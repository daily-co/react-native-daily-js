# react-native-daily-js

The Daily JavaScript library for React Native.

## Minimum OS/SDK versions

This package introduces some constraints on what OS/SDK versions your project can support:

- **iOS**: Deployment target >= 10.0
- **Android**: `minSdkVersion` >= 23

## Installation

Install `react-native-daily-js` along with its peer dependencies:

```bash
npm i @daily-co/react-native-daily-js @daily-co/react-native-webrtc @react-native-community/async-storage react-native-background-timer
```

Then, follow the below steps to set up your native project on each platform. **Note that these steps assume you're using a version of React Native that supports autolinking (>= 60).**

### iOS

Update the `platform` in your `Podfile`, since `@daily-co/react-native-webrtc` only works on iOS 10 and above:

```ruby
platform :ios, '10.0'
```

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
    <string>"Daily Playground needs camera access to work"</string>
    <key>NSMicrophoneUsageDescription</key>
    <string>"Daily Playground needs microphone access to work"</string>
    <key>UIBackgroundModes</key>
    <array>
        <string>voip</string>
    </array>
    ...
</dict>
```

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

<application>
  // ...
  <service android:name="com.daily.reactlibrary.DailyOngoingMeetingForegroundService"/>
</application>
```

Update your `minSdkVersion` in your top-level `build.gradle` file:

```groovy
minSdkVersion = 23
```

(If you run into any issues, refer to [Github issues](https://github.com/react-native-webrtc/react-native-webrtc/issues/720) like [these](https://github.com/jitsi/jitsi-meet/issues/4778), or the `react-native-webrtc` [installation docs](https://github.com/react-native-webrtc/react-native-webrtc/blob/master/Documentation/AndroidInstallation.md), which walk you through a more complicated process. The simpler process laid out above seems to work in a vanilla modern React Native CLI-based setup).

## Room configuration

Your Daily room must be configured in a particular way in order for a `react-native-daily-js` client to be able to connect to it: it must specify the property `signaling_impl: ws`.

To create a room with the `signaling_impl` property set appropriately, run the following (replacing `<your-api-key>` with your actual API key):

```bash
curl --request POST \
  --url https://api.daily.co/v1/rooms \
  --header 'authorization: Bearer <your-api-key>' \
  --header 'content-type: application/json' \
  --data '{"properties":{"signaling_impl":"ws"}}'
```

Of course, you may also want to specify a name as well as other properties. See the [Daily REST API docs](https://docs.daily.co/reference#rooms) for general guidance on how to create a new room or update an existing room.

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
