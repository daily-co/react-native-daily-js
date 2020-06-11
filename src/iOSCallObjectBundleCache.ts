import AsyncStorage from '@react-native-community/async-storage';

const FIELD_CACHE_EXPIRY = 'expiry';
const FIELD_BUNDLE_CODE = 'code';
const FIELD_BUNDLE_LAST_MODIFIED = 'last-modified';
const FIELD_BUNDLE_ETAG = 'etag';

const DEFAULT_EXPIRY_MS = 60 * 1000;

function cacheKeyForUrl(url: string): string {
  return `callobj_bundle_${url}`;
}

/**
 * A workaround for the fact that the iOS HTTP cache won't cache the call
 * object bundle due to size.
 */
export default class iOSCallObjectBundleCache {
  static async get(url: string): Promise<string | null> {
    // console.log("[iOSCallObjectBundleCache] get", url);

    const now = Date.now();

    try {
      // Get bundle code + metadata from cache
      const cacheItemString = await AsyncStorage.getItem(cacheKeyForUrl(url));

      // If cache miss, return null
      if (!cacheItemString) {
        return null;
      }

      const cacheItem = JSON.parse(cacheItemString);

      // Check cache item for missing required fields
      const requiredCacheFields = [FIELD_CACHE_EXPIRY, FIELD_BUNDLE_CODE];
      for (const field of requiredCacheFields) {
        if (!cacheItem[field]) {
          throw new Error(`Missing cache item field: ${field}`);
        }
      }

      // If cache expired, clear it and return null
      if (Date.now() > cacheItem[FIELD_CACHE_EXPIRY]) {
        // console.log("[iOSCallObjectBundleCache] cache item expired");
        AsyncStorage.removeItem(cacheKeyForUrl(url));
        return null;
      }

      // Return cached code
      return cacheItem[FIELD_BUNDLE_CODE];
    } catch (e) {
      // console.log("[iOSCallObjectBundleCache] error in get", url, e);

      // Clear potentially problematic cache entry and return null
      AsyncStorage.removeItem(cacheKeyForUrl(url));
      return null;
    }
  }

  static async set(url: string, code: string, headers: Headers): Promise<void> {
    // console.log("[iOSCallObjectBundleCache] set", url, headers);

    if (!code) {
      return;
    }

    // Get cache expiry from cache-control header
    let expiry = DEFAULT_EXPIRY_MS;
    const cacheControlHeader = headers.get('cache-control');
    if (cacheControlHeader && cacheControlHeader.includes('public')) {
      const expiryString = cacheControlHeader.match(/max-age=([0-9]+)/i);
      if (expiryString && expiryString[1] && Number(expiryString[1])) {
        expiry = Date.now() + Number(expiryString[1]) * 1000;
      }
    }

    let cacheItem: { [key: string]: any } = {};
    cacheItem[FIELD_BUNDLE_CODE] = code;
    cacheItem[FIELD_CACHE_EXPIRY] = expiry;

    return AsyncStorage.setItem(cacheKeyForUrl(url), JSON.stringify(cacheItem));
  }
}
