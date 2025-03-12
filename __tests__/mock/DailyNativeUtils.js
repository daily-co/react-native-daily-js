// Mock implementation of DailyNativeUtils for testing
const DailyNativeUtils = {
  setKeepDeviceAwake: jest.fn(),
  presentSystemScreenCapturePrompt: jest.fn(),
  requestStopSystemScreenCapture: jest.fn()
};

export { DailyNativeUtils }; 