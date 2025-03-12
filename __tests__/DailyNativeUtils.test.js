import { NativeModules } from 'react-native';
// Import our mock implementation
import { DailyNativeUtils } from './mock/DailyNativeUtils';

// Get access to the mocked modules
const nativeModule = NativeModules.DailyNativeUtils;

// Tests for DailyNativeUtils with legacy architecture
describe('DailyNativeUtils - Legacy Architecture', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Set to legacy architecture
    global.REACT_NATIVE_ARCH = 'legacy';
  });

  test('setKeepDeviceAwake calls native module', () => {
    DailyNativeUtils.setKeepDeviceAwake(true, 'testApp');
    expect(DailyNativeUtils.setKeepDeviceAwake).toHaveBeenCalledWith(true, 'testApp');

    DailyNativeUtils.setKeepDeviceAwake(false, 'testApp');
    expect(DailyNativeUtils.setKeepDeviceAwake).toHaveBeenCalledWith(false, 'testApp');
  });

  test('presentSystemScreenCapturePrompt calls native module', () => {
    DailyNativeUtils.presentSystemScreenCapturePrompt();
    expect(DailyNativeUtils.presentSystemScreenCapturePrompt).toHaveBeenCalled();
  });

  test('requestStopSystemScreenCapture calls native module', () => {
    DailyNativeUtils.requestStopSystemScreenCapture();
    expect(DailyNativeUtils.requestStopSystemScreenCapture).toHaveBeenCalled();
  });
});

// Additional tests for new architecture can be added here 