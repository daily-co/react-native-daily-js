import * as React from 'react';
import { ViewStyle, View, Platform, NativeModules } from 'react-native';
import {
  MediaStreamTrack,
  RTCView,
  MediaStream,
  RTCViewProps,
} from 'react-native-webrtc';

const { DailyNativeUtils } = NativeModules;
const ANDROID_NEW_STREAM_READY_DELAY_MS = 250;

function useMediaPlayRegistration(track: MediaStreamTrack | null) {
  React.useEffect(() => {
    if (!track) {
      return;
    }
    DailyNativeUtils.registerStartedPlayingMedia(track.id);
    return () => {
      DailyNativeUtils.registerStoppedPlayingMedia(track.id);
    };
  }, [track]);
}

type Props = {
  videoTrack: MediaStreamTrack | null;
  audioTrack: MediaStreamTrack | null;
  mirror?: RTCViewProps['mirror'];
  zOrder?: RTCViewProps['zOrder'];
  objectFit?: RTCViewProps['objectFit'];
  style?: ViewStyle;
};

export default function DailyMediaView(props: Props) {
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  useMediaPlayRegistration(props.videoTrack);
  useMediaPlayRegistration(props.audioTrack);

  React.useEffect(() => {
    const tracks = [props.videoTrack, props.audioTrack].filter((t) => t);
    const stream = tracks.length > 0 ? new MediaStream(tracks) : null;
    // Temporary workaround for an Android react-native-webrtc threading bug
    // where a newly-created stream is sometimes not yet ready for use
    // immediately in the JS thread. Waiting a little is not necessarily
    // foolproof, but I haven't seen an issue with this during local testing.
    if (Platform.OS === 'android') {
      setTimeout(() => {
        setStream(stream);
      }, ANDROID_NEW_STREAM_READY_DELAY_MS);
    } else {
      setStream(stream);
    }
  }, [props.videoTrack, props.audioTrack]);

  const rtcView = stream ? (
    <RTCView
      streamURL={stream.toURL()}
      mirror={props.mirror}
      zOrder={props.zOrder}
      objectFit={props.objectFit}
      // hide if no video track (still plays audio).
      // hiding is important since otherwise it shows a frozen frame.
      style={props.videoTrack ? props.style : { display: 'none' }}
    />
  ) : null;

  // provide empty placeholder when no video is playing, to try to avoid
  // messing with any layout that depends on this DailyMediaView's style
  const placeholderView = props.videoTrack ? null : (
    <View style={props.style} />
  );

  return (
    <>
      {rtcView}
      {placeholderView}
    </>
  );
}
