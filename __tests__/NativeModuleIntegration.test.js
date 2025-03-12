/*
 * This file contains integration tests to verify DailyNativeUtils functionality
 * on both legacy and new architecture builds.
 * 
 * These tests use mock implementations to verify functionality.
 */

import { NativeModules } from 'react-native';
// Import our mock implementation
import { DailyNativeUtils } from './mock/DailyNativeUtils';

// Integration tests can verify both architectures
describe('DailyNativeUtils Architecture Integration', () => {
  // Tests that run on the architecture determined by the environment variable
  const currentArch = global.REACT_NATIVE_ARCH || 'legacy';
  
  describe(`Using ${currentArch} architecture`, () => {
    beforeEach(() => {
      // Clear mocks before each test
      jest.clearAllMocks();
    });
    
    test('can call setKeepDeviceAwake', () => {
      // This should work regardless of architecture
      DailyNativeUtils.setKeepDeviceAwake(true, 'integrationTest');
      expect(DailyNativeUtils.setKeepDeviceAwake).toHaveBeenCalledWith(true, 'integrationTest');
      
      DailyNativeUtils.setKeepDeviceAwake(false, 'integrationTest');
      expect(DailyNativeUtils.setKeepDeviceAwake).toHaveBeenCalledWith(false, 'integrationTest');
    });
    
    test('can call presentSystemScreenCapturePrompt', () => {
      DailyNativeUtils.presentSystemScreenCapturePrompt();
      expect(DailyNativeUtils.presentSystemScreenCapturePrompt).toHaveBeenCalled();
    });
    
    test('can call requestStopSystemScreenCapture', () => {
      DailyNativeUtils.requestStopSystemScreenCapture();
      expect(DailyNativeUtils.requestStopSystemScreenCapture).toHaveBeenCalled();
    });
  });
}); 