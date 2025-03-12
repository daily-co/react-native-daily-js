// Mock any global objects and environment variables needed for tests

// Set React Native architecture mode based on environment variable
// This value can be accessed in tests to simulate different architecture behaviors
global.REACT_NATIVE_ARCH = process.env.REACT_NATIVE_ARCH || 'legacy';

// Mock React Native
jest.mock('react-native', () => {
  return {
    // Legacy architecture
    NativeModules: {
      DailyNativeUtils: {
        setKeepDeviceAwake: jest.fn(),
        presentSystemScreenCapturePrompt: jest.fn(),
        requestStopSystemScreenCapture: jest.fn(),
        __mocked: true,
      },
    },
    // New architecture
    TurboModuleRegistry: {
      get: jest.fn((name) => {
        if (name === 'DailyNativeUtils') {
          return {
            setKeepDeviceAwake: jest.fn(),
            presentSystemScreenCapturePrompt: jest.fn(),
            requestStopSystemScreenCapture: jest.fn(),
            __mocked: true,
          };
        }
        return null;
      }),
    },
    // Additional React Native APIs used in the library
    Platform: {
      OS: 'ios',
      select: jest.fn(obj => obj.ios || obj.default),
    },
  };
}); 