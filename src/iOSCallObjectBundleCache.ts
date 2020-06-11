import AsyncStorage from '@react-native-community/async-storage';

/**
 * A workaround for the fact that the iOS HTTP cache won't cache the call
 * object bundle due to size.
 */
export default class iOSCallObjectBundleCache {
  static get(url: string): Promise<string | null> {
    // console.log("[iOSCallObjectBundleCache] get", url);
    return AsyncStorage.getItem(`callobj_bundle_${url}`);
  }

  static set(url: string, bundle: string): Promise<void> {
    // console.log("[iOSCallObjectBundleCache] set", url);
    return AsyncStorage.setItem(`callobj_bundle_${url}`, bundle);
  }
}
