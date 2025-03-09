# Add React Native New Architecture (TurboModule) Support

## Problem

The library currently only supports the legacy React Native bridge architecture. As a result, it doesn't work properly with newer versions of React Native that use the new architecture, such as Expo v52+. Specifically, methods like `setKeepDeviceAwake` are reported as undefined when used with the new architecture.

## Solution

This PR adds support for React Native's new architecture (TurboModules) while maintaining backward compatibility with the legacy architecture. The implementation enables the native module to be properly registered and accessed in both architectures.

### Changes Made:

1. **Created a TurboModule interface specification**:
   - Added `DailyNativeUtilsSpec.java` that extends the TurboModule interface
   - Defined the methods that should be exposed to JavaScript

2. **Updated the native module implementation**:
   - Modified `DailyNativeUtils.java` to implement the TurboModule interface
   - Maintained backward compatibility by keeping the ReactContextBaseJavaModule implementation

3. **Added TurboModule support classes**:
   - Created `DailyNativeUtilsTurboModuleFactory.java` for creating TurboModule instances
   - Added `DailyNativeUtilsTurboPackage.java` to register the module with the TurboModule system
   - Created `DailyNativeUtilsNewArchitectureProvider.java` as a helper for registration

4. **Updated build configuration**:
   - Modified `build.gradle` to include TurboModule dependencies
   - Added necessary build features for supporting the new architecture

5. **Updated documentation**:
   - Added a section in the README about New Architecture support

## Testing

This PR has been tested with Expo v52 (which uses the new architecture) and confirmed that the `setKeepDeviceAwake` method now works correctly. It's also been verified with older React Native versions to ensure backward compatibility.

## Next Steps

Additional work needed:

1. Update the iOS native module with similar TurboModule support
2. Add automated tests specifically for the new architecture
3. Update other methods if necessary to ensure full compatibility

## References

- [React Native New Architecture Documentation](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)
- [Creating Native Modules with TurboModules](https://reactnative.dev/docs/turbo-native-modules-introduction)