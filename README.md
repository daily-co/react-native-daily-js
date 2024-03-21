# react-native-daily-js

The Daily JavaScript library for React Native.

## Minimum OS/SDK versions

This package introduces some constraints on what OS/SDK versions your project can support:

- **iOS**: Deployment target >= 12.0
- **Android**: `minSdkVersion` >= 24

## Installation

Install `react-native-daily-js` along with its peer dependencies:

```bash
npm i @daily-co/react-native-daily-js @react-native-async-storage/async-storage@^1.15.7 react-native-background-timer@^2.3.1 react-native-get-random-values@^1.9.0
npm i --save-exact @daily-co/react-native-webrtc@118.0.3-daily.1
```

Then, follow the below steps to set up your native project on each platform. **Note that these steps assume you're using a version of React Native that supports autolinking (>= 60).**

> If your project uses [Expo](https://expo.dev/), use the [`config-plugin-rn-daily-js` configuration package](https://www.npmjs.com/package/@daily-co/config-plugin-rn-daily-js) instead of the following steps.

### iOS

Update the `platform` in your `Podfile`, since `@daily-co/react-native-webrtc` only works on iOS 12 and above:

```ruby
platform :ios, '12.0'
```

> If you wish to **send screen share** from iOS, it only works on **iOS 14** and above. Therefore, in this case, please switch to using iOS 14.0 instead of iOS 12.0.

Then run:

```bash
npx pod-install
```

Next, you will need to update your project's `Info.plist` to add three new rows with the following keys:

- `NSCameraUsageDescription`
- `NSMicrophoneUsageDescription`
- `UIBackgroundModes`

For the first two key's values, provide user-facing strings explaining why your app is asking for camera and microphone access. **Note that the app will simply crash silently without these.**

`UIBackgroundModes` is handled slightly differently and will resolve to an array. For its first item, specify the value `voip`. This ensures that audio will continue uninterrupted when your app is sent to the background.

To add the new rows through Xcode, open the `Info.plist` and add the following three rows:

| Key                                    | Type   | Value                                              |
| -------------------------------------- | ------ | -------------------------------------------------- |
| Privacy - Camera Usage Description     | String | "Daily Playground needs camera access to work"     |
| Privacy - Microphone Usage Description | String | "Daily Playground needs microphone access to work" |
| Required background modes              | Array  | 1 item                                             |
| ---> Item 0                            | String | "App provides Voice over IP services"              |

If you view the raw file contents of `Info.plist`, it should look like this:

```
<dict>
    ...
    <key>NSCameraUsageDescription</key>
    <string>Daily Playground needs camera access to work</string>
    <key>NSMicrophoneUsageDescription</key>
    <string>Daily Playground needs microphone access to work</string>
    <key>UIBackgroundModes</key>
    <array>
        <string>voip</string>
    </array>
    ...
</dict>
```

#### Screen sharing on iOS

To use the screen sharing functionality on iOS, you'll need to do a few manual steps to set up Daily's [React Native Screen Share Extension framework](https://github.com/daily-co/rn-screen-share-extension/) (already included in `react-native-daily-js`).
Please refer to its README for a detailed walkthrough.

### Android

Add the following to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" />
<uses-feature android:name="android.hardware.camera.autofocus"/>

<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>

<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_CAMERA"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION"/>
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>

<application>
  // ...
  <service android:name="com.daily.reactlibrary.DailyOngoingMeetingForegroundService" android:foregroundServiceType="camera|microphone"/>
</application>
```

> Note: above, `android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION` is only needed if you wish to do screen sharing.

Update your `minSdkVersion` in your top-level `build.gradle` file:

```groovy
minSdkVersion = 24
```

(If you run into any issues, refer to [Github issues](https://github.com/react-native-webrtc/react-native-webrtc/issues/720) like [these](https://github.com/jitsi/jitsi-meet/issues/4778), or the `react-native-webrtc` [installation docs](https://github.com/react-native-webrtc/react-native-webrtc/blob/master/Documentation/AndroidInstallation.md), which walk you through a more complicated process. The simpler process laid out above seems to work in a vanilla modern React Native CLI-based setup).

## Usage

`react-native-daily-js` is the React Native counterpart to `daily-js`, and can be used in pretty much the same way to add video calls to your apps. [Complete documentation for `react-native-daily-js` (as well as `daily-js`) can be found here](https://docs.daily.co/reference#using-the-react-native-daily-js-library).

```ts
import Daily from '@daily-co/react-native-daily-js';

// ...

// Start joining a call
const call = Daily.createCallObject();
call.join({ url: 'https://your-team.daily.co/allhands' });

// Listen for events signaling changes to participants or their audio or video.
// - 'participant-joined' and 'participant-left' are for remote participants only
// - 'participant-updated' is for the local participant as well as remote participants
const events: DailyEvent[] = [
  'participant-joined',
  'participant-updated',
  'participant-left',
];
for (const event of events) {
  call.on(event, () => {
    for (const participant of Object.values(call.participants())) {
      console.log('---');
      console.log(`participant ${participant.user_id}:`);
      if (participant.local) {
        console.log('is local');
      }
      if (participant.audio) {
        console.log('audio enabled', participant.audioTrack);
      }
      if (participant.video) {
        console.log('video enabled', participant.videoTrack);
      }
    }
  });
}
```

```tsx
import { DailyMediaView } from '@daily-co/react-native-daily-js';

// ...

<DailyMediaView
  videoTrack={participant.videoTrack}
  audioTrack={participant.audioTrack}
  mirror={participant.local}
  zOrder={participant.local ? 1 : 0}
  style={someStyle}
/>;
```

[See this blog post for a more thorough walkthrough of structuring a React video-chat app powered by Daily](https://www.daily.co/blog/building-a-custom-video-chat-app-with-react). It's focused on React web, but most of it should also apply to your React Native app.

## Assorted considerations for app implementers

### Participant count

Keep in mind that simultaneously displaying videos for numerous participants can use up a lot of your phone's resources. This can make the app run more slowly and use up more of your battery, especially if you're using an older device. For larger meetings, consider only displaying a few videos at a time. In a future release, `daily-js`'s [track subscription APIs](https://www.daily.co/blog/create-dynamic-meetings-using-track-subscriptions/) will be brought over to `react-native-daily-js`, letting you avoid the network bandwidth cost of receiving video for off-screen participants.

### Device orientation

If you'd like to support rotating your phone while in a call, it's recommended that you do not restrict your app's supported orientations (i.e. through `Info.plist` or `AndroidManifest.xml`).

If you _are_ restricting your app's supported orientations (to portrait, for example), note that by default you'll end up with somewhat divergent video behavior on iOS and Android whenever you _do_ rotate your phone (to landscape, for example).

On iOS, your captured video will rotate to compensate for the phone's rotation, meaning that:

- Other participants will continue to see you upright
- Your local video will be oriented the same way as other participant's videos on your phone (so you'd now need to cock your head to see it upright)

On Android, your captured video will _not_ rotate to compensate for the phone's rotation, meaning that:

- Other participants will now see you sideways
- Your local video will _not_ be oriented the same way as other participant's videos on your phone (it will appear upright to you)
