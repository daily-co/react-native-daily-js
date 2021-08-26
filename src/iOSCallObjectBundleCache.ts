import AsyncStorage from '@react-native-async-storage/async-storage';

const FIELD_CACHE_EXPIRY = 'expiry';
const FIELD_BUNDLE_CODE = 'code';
const FIELD_BUNDLE_LAST_MODIFIED = 'last-modified';
const FIELD_BUNDLE_ETAG = 'etag';

const REQUIRED_FIELDS = [FIELD_BUNDLE_CODE, FIELD_CACHE_EXPIRY];

const DEFAULT_EXPIRY_MS = 60 * 1000;

function cacheKeyForUrl(url: string): string {
  return `callobj_bundle_${url}`;
}

type CacheResponse = {
  code?: string;
  refetchHeaders?: Headers;
};

/**
 * A workaround for the fact that the iOS HTTP cache won't cache the call
 * object bundle due to size.
 */
export default class iOSCallObjectBundleCache {
  static async get(
    url: string,
    ignoreExpiry = false
  ): Promise<CacheResponse | null> {
    // console.log("[iOSCallObjectBundleCache] get", url);

    const now = Date.now();

    try {
      // Get bundle code + metadata from cache
      const cacheItemString = await AsyncStorage.getItem(cacheKeyForUrl(url));

      // If cache miss, return null
      if (!cacheItemString) {
        return null;
      }

      const cacheItem: { [key: string]: any } = JSON.parse(cacheItemString);

      // Check cache item for missing required fields
      for (const field of REQUIRED_FIELDS) {
        if (!cacheItem[field]) {
          throw new Error(
            `Missing call object bundle cache item field: ${field}`
          );
        }
      }

      // If cache expired, return headers needed to conditionally fetch the
      // bundle again
      if (!ignoreExpiry && now > cacheItem[FIELD_CACHE_EXPIRY]) {
        // console.log("[iOSCallObjectBundleCache] cache item expired");
        let headers: { [key: string]: string } = {};
        // Only set headers for validators (ETag, Last-Modified) that exist in
        // the cache item
        cacheItem[FIELD_BUNDLE_ETAG] &&
          (headers['if-none-match'] = cacheItem[FIELD_BUNDLE_ETAG]);
        cacheItem[FIELD_BUNDLE_LAST_MODIFIED] &&
          (headers['if-modified-since'] =
            cacheItem[FIELD_BUNDLE_LAST_MODIFIED]);
        return { refetchHeaders: new Headers(headers) };
      }

      // Return cached code
      return { code: cacheItem[FIELD_BUNDLE_CODE] };
    } catch (e) {
      // console.log("[iOSCallObjectBundleCache] error in get", url, e);

      // Clear potentially problematic cache entry and return null
      AsyncStorage.removeItem(cacheKeyForUrl(url));
      return null;
    }
  }

  static async renew(url: string, headers: Headers): Promise<CacheResponse> {
    // console.log("[iOSCallObjectBundleCache] renew", url);

    const cacheResponse = await this.get(url, true);

    if (!(cacheResponse && cacheResponse.code)) {
      throw new Error(
        'Attempting to renew a call object bundle cache item that is missing'
      );
    }

    this.set(url, cacheResponse.code, headers);

    return cacheResponse;
  }

  static async set(url: string, code: string, headers: Headers): Promise<void> {
    // console.log("[iOSCallObjectBundleCache] set", url, headers);

    if (!code) {
      return;
    }

    // Get cache expiry from cache-control header (or use a default value)
    let expiry = DEFAULT_EXPIRY_MS;
    const cacheControlHeader = headers.get('cache-control');
    if (cacheControlHeader) {
      const expiryMatch = cacheControlHeader.match(/max-age=([0-9]+)/i);
      if (expiryMatch && expiryMatch[1] && !isNaN(Number(expiryMatch[1]))) {
        expiry = Date.now() + Number(expiryMatch[1]) * 1000;
      }
    }

    // Get validators for conditional requests
    const etag = headers.get('etag');
    const lastModified = headers.get('last-modified');

    let cacheItem: { [key: string]: any } = {};
    cacheItem[FIELD_BUNDLE_CODE] = code;
    cacheItem[FIELD_CACHE_EXPIRY] = expiry;
    cacheItem[FIELD_BUNDLE_ETAG] = etag;
    cacheItem[FIELD_BUNDLE_LAST_MODIFIED] = lastModified;

    return AsyncStorage.setItem(cacheKeyForUrl(url), JSON.stringify(cacheItem));
  }
}
