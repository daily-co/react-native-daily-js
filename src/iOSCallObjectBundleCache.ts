/**
 * A workaround for the fact that the iOS HTTP cache is not caching the call
 * object bundle due to size.
 */
export default class iOSCallObjectBundleCache {
  static get(url: string): Promise<string> {
    return Promise.reject();
  }
}
