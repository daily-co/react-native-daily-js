# react-native-daily-js

The Daily.co JavaScript library for React Native.

## Minimum OS/SDK versions

This package introduces some constraints on what OS/SDK versions your project can support:

- **iOS**: Deployment target >= 10.0
- **Android**: `minSdkVersion` >= 21

## Installation

`react-native-daily-js` has a couple of peer dependencies you'll have to install:

```bash
npm i react-native-webrtc @react-native-community/async-storage
```

Then, follow the below steps to set up your native project on each platform. **Note that these steps assume you're using a version of React Native that supports autolinking (>= 60).**

### iOS

Update the `platform` in your `Podfile`, since `react-native-webrtc` only works on iOS 10 and above:

```ruby
platform :ios, '10.0'
```

Then run:

```bash
npx pod-install
```

Finally, open Xcode, and in your project's `Info.plist` file add two new rows with the following keys:

- `NSCameraUsageDescription`
- `NSMicrophoneUsageDescription`

For their values, provide user-facing strings explaining why your app is asking for camera and microphone access. Without these, the app will simply crash silently.

### Android

Add the following permissions to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" />
<uses-feature android:name="android.hardware.camera.autofocus"/>

<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

Update your `minSdkVersion` in your top-level `build.gradle` file:

```groovy
minSdkVersion = 21
```

(You _may_ run into other issues, even though they appear to be resolved in a vanilla modern RN CLI-based setup. If you do, refer to [issues](https://github.com/react-native-webrtc/react-native-webrtc/issues/720) like [these](https://github.com/jitsi/jitsi-meet/issues/4778), or the `react-native-webrtc` [installation docs](https://github.com/react-native-webrtc/react-native-webrtc/blob/master/Documentation/AndroidInstallation.md), which walk you through a significantly more complicated process.)

## Notes for developers working on `react-native-daily-js`

### TypeScript configuration

We have a slightly unusual/complex TypeScript setup since we have the following constraints:

- The `daily-js` package is meant for usage in the browser. As part of its type declarations, it should reference browser versions of WebRTC primitives (like `MediaStreamTrack`).
- The `react-native-daily-js` package is meant for usage in React Native, with the aid of the `react-native-webrtc` library. As part of its type declarations, it should reference `react-native-webrtc` versions of those same WebRTC primitives.

To do this, the `react-native-daily-js` package must:

1. Override the types provided by `daily-js` during its compilation step.
2. Expose those overridden types rather than `daily-js`'s original types when consumed by another project.

The following lines in `tsconfig.json` achieves step 1, causing the compiler not to attempt to pull in the web-specific `@daily-co/daily-js` types:

```json
"paths": {
  "@daily-co/daily-js": ["type-overrides/@daily-co/daily-js"]
}
```

But this isn't enough. If we stopped there, the generated `index.d.ts` would include lines like:

```js
import DailyIframe from '@daily-co/daily-js';
```

In the project consuming `react-native-daily-js`, then, we'd still pull in types from `@daily-co/daily-js`'s standard install location in `node_modules`, which would be the web-specific types! To resolve this, we have the following postbuild step in `package.json` that modifies `index.d.ts` to point to the React Native-specific overrides:

```json
"postbuild": "sed -E -i.bak 's|@daily-co/daily-js|../type-overrides/@daily-co/daily-js|g' ./dist/index.d.ts && rm ./dist/index.d.ts.bak",
```
