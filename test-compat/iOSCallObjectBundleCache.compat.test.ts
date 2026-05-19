/**
 * Compatibility tests for iOSCallObjectBundleCache against all three supported
 * major versions of @react-native-async-storage/async-storage.
 *
 * Each version is installed under an npm alias (see package.json) so all three
 * can coexist in node_modules at the same time.  The test suite is defined once
 * and executed against the real mock shipped by each version, giving us:
 *
 *  1. Runtime proof that our cache logic works with each version's mock.
 *  2. Compile-time proof (via the assignability assertions below) that each
 *     version's public type satisfies our AsyncStorageInterface.
 */

import iOSCallObjectBundleCache, {
  AsyncStorageInterface,
} from '../src/iOSCallObjectBundleCache';

// --- real mocks from each version -----------------------------------------
//
// v1 / v2 ship a CommonJS singleton in jest/async-storage-mock.
// v3 ships an ESM class-based instance via the "jest" subpath export.

import AsyncStorageV1 from 'async-storage-v1/jest/async-storage-mock';
import AsyncStorageV2 from 'async-storage-v2/jest/async-storage-mock';
import AsyncStorageV3, { clearAllMockStorages } from 'async-storage-v3/jest';

// Compile-time check: every version's public type must satisfy our interface.
// If a future version changes getItem / setItem / removeItem in a breaking way
// this file will no longer compile.
const _v1: AsyncStorageInterface = AsyncStorageV1;
const _v2: AsyncStorageInterface = AsyncStorageV2;
const _v3: AsyncStorageInterface = AsyncStorageV3;

// --------------------------------------------------------------------------

const URL = 'https://example.com/bundle.js';
const CODE = 'console.log("bundle");';
const ETAG = '"abc123"';
const LAST_MODIFIED = 'Wed, 06 May 2026 15:20:32 GMT';
const NOW = 1_000_000_000_000;

// --------------------------------------------------------------------------
// Shared test suite
// --------------------------------------------------------------------------

function runSuite(
  label: string,
  storage: AsyncStorageInterface,
  resetStorage: () => Promise<void>
) {
  describe(label, () => {
    let mockNow = NOW;

    beforeEach(async () => {
      mockNow = NOW;
      jest.spyOn(Date, 'now').mockImplementation(() => mockNow);
      await resetStorage();
      iOSCallObjectBundleCache.initialize(storage);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('get()', () => {
      it('returns null on cache miss', async () => {
        expect(await iOSCallObjectBundleCache.get(URL)).toBeNull();
      });

      it('serves code from a fresh cache entry', async () => {
        await iOSCallObjectBundleCache.set(
          URL,
          CODE,
          new Headers({ 'cache-control': 'max-age=3600' })
        );
        const result = await iOSCallObjectBundleCache.get(URL);
        expect(result?.code).toBe(CODE);
      });

      it('returns refetchHeaders with ETag when cache has expired', async () => {
        await iOSCallObjectBundleCache.set(
          URL,
          CODE,
          new Headers({ 'cache-control': 'max-age=3600', etag: ETAG })
        );
        mockNow = NOW + 3_601_000;

        const result = await iOSCallObjectBundleCache.get(URL);
        expect(result?.code).toBeUndefined();
        expect(result?.refetchHeaders?.get('if-none-match')).toBe(ETAG);
      });

      it('returns refetchHeaders with Last-Modified when cache has expired', async () => {
        await iOSCallObjectBundleCache.set(
          URL,
          CODE,
          new Headers({
            'cache-control': 'max-age=3600',
            'last-modified': LAST_MODIFIED,
          })
        );
        mockNow = NOW + 3_601_000;

        const result = await iOSCallObjectBundleCache.get(URL);
        expect(result?.code).toBeUndefined();
        expect(result?.refetchHeaders?.get('if-modified-since')).toBe(
          LAST_MODIFIED
        );
      });

      it('still returns code for an expired entry when ignoreExpiry=true', async () => {
        await iOSCallObjectBundleCache.set(
          URL,
          CODE,
          new Headers({ 'cache-control': 'max-age=3600' })
        );
        mockNow = NOW + 3_601_000;

        const result = await iOSCallObjectBundleCache.get(URL, true);
        expect(result?.code).toBe(CODE);
      });

      it('uses the default 60 s TTL when there is no cache-control header', async () => {
        await iOSCallObjectBundleCache.set(URL, CODE, new Headers());

        // Still fresh at 59 s
        mockNow = NOW + 59_000;
        expect((await iOSCallObjectBundleCache.get(URL))?.code).toBe(CODE);

        // Expired at 61 s
        mockNow = NOW + 61_000;
        expect((await iOSCallObjectBundleCache.get(URL))?.code).toBeUndefined();
      });
    });

    describe('renew()', () => {
      it('resets expiry on a 304 flow and then serves from cache', async () => {
        // 1. Prime the cache
        await iOSCallObjectBundleCache.set(
          URL,
          CODE,
          new Headers({ 'cache-control': 'max-age=3600', etag: ETAG })
        );

        // 2. Expire it
        mockNow = NOW + 3_601_000;
        expect((await iOSCallObjectBundleCache.get(URL))?.code).toBeUndefined();

        // 3. Renew (simulates a 304 response with a fresh max-age)
        const renewed = await iOSCallObjectBundleCache.renew(
          URL,
          new Headers({ 'cache-control': 'max-age=3600' })
        );
        expect(renewed.code).toBe(CODE);

        // 4. Cache is fresh again
        expect((await iOSCallObjectBundleCache.get(URL))?.code).toBe(CODE);
      });

      it('throws when there is nothing in the cache to renew', async () => {
        await expect(
          iOSCallObjectBundleCache.renew(URL, new Headers())
        ).rejects.toThrow(
          'Attempting to renew a call object bundle cache item that is missing'
        );
      });
    });
  });
}

// --------------------------------------------------------------------------
// Execute the suite against each version
// --------------------------------------------------------------------------

// v1: reset by clearing the singleton's internal storage object
const resetV1 = async () => {
  await AsyncStorageV1.clear();
};

// v2: same shape as v1
const resetV2 = async () => {
  await AsyncStorageV2.clear();
};

// v3: the default export is a named AsyncStorageMemoryImpl instance;
// clear() wipes its internal Map without invalidating the reference.
// We also call clearAllMockStorages() so named instances created via
// createAsyncStorage() are also reset across tests.
const resetV3 = async () => {
  await AsyncStorageV3.clear();
  clearAllMockStorages();
};

runSuite('async-storage v1', _v1, resetV1);
runSuite('async-storage v2', _v2, resetV2);
runSuite('async-storage v3', _v3, resetV3);
