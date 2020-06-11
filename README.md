# react-native-daily-js

The Daily.co JavaScript library for React Native.

## Minimum OS/SDK versions

This package introduces some constraints on what OS/SDK versions your project can support:

- **iOS**: Deployment target >= 10.0
- **Android**:
  - `minSdkVersion` >= 21 (if you downgrade to gradle 3.3.2)
  - `minSdkVersion` >= 24 (if you're depending on a newer version of gradle)

The above can be specified in your Xcode project settings and your Android project-level `build.gradle` file, respectively.

## React Native WebRTC Installation

Under the hood, `react-native-daily-js` depends on `react-native-webrtc`, the popular implementation of WebRTC for React Native. While this package is bundled with `react-native-daily-js`, it does require a bit of configuration in your app.

### iOS

If you're using Cocoapods, update your `Podfile` with the following:

```ruby
pod 'react-native-webrtc', :path => '../node_modules/react-native-webrtc'
pod 'RNCAsyncStorage', :path => '../node_modules/@react-native-community/async-storage'
```

You also may have to update your `platform`, since `react-native-webrtc` only works on iOS 10 and above:

```ruby
platform :ios, '10.0'
```

Then run `pod install` as usual to generate a new `xcworkspace`.

If you're not using Cocoapods, see [react-native-webrtc's manual installation instructions](https://github.com/react-native-webrtc/react-native-webrtc/blob/master/Documentation/iOSInstallation.md).

Finally, in your Xcode project's `Info.plist`, provide user-facing strings explaining why your app is asking for camera and microphone access, under the following keys:

- `NSCameraUsageDescription`
- `NSMicrophoneUsageDescription`

Note that your app will not be able to even prompt for access if these strings aren't specified.

### Android

For a new project, you'll likely have to follow a subset of the steps laid out in [react-native-webrtc's installation instructions](https://github.com/react-native-webrtc/react-native-webrtc/blob/master/Documentation/AndroidInstallation.md). **If the below steps don't work for you, please refer to the full instructions.**

First, you'll need to add the following permissions to `AndroidManifest.xml`:

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

You'll also need to update your `settings.gradle` to include `':WebRTCModule'`:

```xml
include ':WebRTCModule', ':app'
project(':WebRTCModule').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-webrtc/android')
```

And declare it a dependency in your app-level `build.gradle`:

```
dependencies {
  // ...
  compile project(':WebRTCModule')
}
```

You'll want to downgrade your gradle version to 3.3.2 if necessary in your app-level `build.gradle`. This will allow you to specify a `minSdkVersion` of 21. See [this discussion](https://www.notion.so/dailyco/RN-call-object-engineering-scratchpad-5e22adf3e9ef497d978ade9dd45187d9#dc842cd474b84bf0b5455c096feb61fb) for a bit of context.

```
classpath("com.android.tools.build:gradle:3.3.2")
```

And in your `gradle-wrapper.properties`, downgrade the `distributionUrl` if needed:

```
distributionUrl=https\://services.gradle.org/distributions/gradle-4.10.1-all.zip
```

Finally, you'll add the WebRTC package in `MainApplication.java`:

```java
import com.oney.WebRTCModule.WebRTCModulePackage;  // <--- Add this line
...
    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage());
      packages.add(new WebRTCModulePackage()); // <-- Add this line
      return packages;
    }
```
