# Testing React Native New Architecture Support

This document outlines how to test the TurboModule support added to the react-native-daily-js library.

## Overview

The library now supports both React Native's legacy architecture and the new architecture (TurboModules). This dual support enables the library to work properly with all versions of React Native, including Expo v52+ which uses the new architecture by default.

## Testing with Your App

### Method 1: Using Local Files

To test the updated version with your application:

1. Clone or download the updated repository
2. In your app's `package.json`, point to the local version:

```json
"dependencies": {
  "react-native-daily-js": "file:../path/to/react-native-daily-js"
}
```

3. Run `npm install` or `yarn install` to update the dependency
4. For Expo apps: Run `npx expo prebuild` to regenerate native code
5. Build and run your app

### Method 2: Using npm/yarn link

For a more dynamic development experience:

1. In the react-native-daily-js directory:
   ```bash
   yarn link  # or npm link
   ```

2. In your application directory:
   ```bash
   yarn link react-native-daily-js  # or npm link react-native-daily-js
   ```

3. Follow the same prebuild and build steps as in Method 1

## Specific Tests to Run

After integrating the library, you should test the following functions to verify TurboModule support:

### 1. Keep Device Awake Test

```javascript
import { DailyNativeUtils } from 'react-native-daily-js';

// Enable keep awake
DailyNativeUtils.setKeepDeviceAwake(true, 'myAppId');
console.log('Keep awake enabled');

// Later, disable keep awake
DailyNativeUtils.setKeepDeviceAwake(false, 'myAppId');
console.log('Keep awake disabled');
```

### 2. Screen Capture Test

```javascript
import { DailyNativeUtils } from 'react-native-daily-js';

// Present screen capture prompt (iOS)
DailyNativeUtils.presentSystemScreenCapturePrompt();

// Request to stop screen capture
DailyNativeUtils.requestStopSystemScreenCapture();
```

## Testing Both Architectures

### Testing Legacy Architecture

For older React Native versions or forcing legacy mode:

```bash
# For Expo
export EXPO_USE_TURBO_MODULES=false
npx expo prebuild --clean
npx expo run:ios  # or run:android

# For React Native CLI
export RCT_NEW_ARCH_ENABLED=0
npx react-native run-ios  # or run-android
```

### Testing New Architecture

For newer React Native versions or forcing new architecture:

```bash
# For Expo
export EXPO_USE_TURBO_MODULES=true  # usually not necessary for Expo 52+
npx expo prebuild --clean
npx expo run:ios  # or run:android

# For React Native CLI
export RCT_NEW_ARCH_ENABLED=1
npx react-native run-ios  # or run-android
```

## Automated Testing

The library includes unit tests:

```bash
# Run unit tests
npm test
```

## Known Issues

1. When switching between architectures, you must clean and rebuild the native projects
2. Some simulators/emulators may require additional setup for screen capturing functionality

## Troubleshooting

If you encounter issues while testing:

1. Check that native modules are properly linked (verify in the Xcode/Android Studio project)
2. Ensure you've rebuilt native code after switching architectures
3. Check device logs for any native module registration errors
4. For Expo, ensure you're using a development build and not Expo Go (which doesn't support custom native modules)

## Reporting Issues

If you find issues with the TurboModule support, please report them with:
- React Native version
- Expo version (if applicable)
- Which architecture you're using (legacy or new)
- Detailed steps to reproduce
- Any relevant error messages from JavaScript and native logs 