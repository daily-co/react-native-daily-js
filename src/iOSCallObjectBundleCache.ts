/**
 * A workaround for the fact that the iOS HTTP cache is not caching the call
 * object bundle due to size.
 */
export default class iOSCallObjectBundleCache {
  static get(url: string): Promise<string> {
    // console.log("[iOSCallObjectBundleCache] get", url);
    return Promise.reject();
  }

  static set(url: string, bundle: string): Promise<void> {
    // console.log("[iOSCallObjectBundleCache] set", url);
    return Promise.reject();
  }
}
