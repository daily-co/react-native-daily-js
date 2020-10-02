import * as React from 'react';
import { useEffect, useState } from 'react';
import { ViewStyle, View, Platform } from 'react-native';
import {
  MediaStreamTrack,
  RTCView,
  MediaStream,
  RTCViewProps,
} from '@daily-co/react-native-webrtc';

type Props = {
  videoTrack: MediaStreamTrack | null;
  audioTrack: MediaStreamTrack | null;
  mirror?: RTCViewProps['mirror'];
  zOrder?: RTCViewProps['zOrder'];
  objectFit?: RTCViewProps['objectFit'];
  style?: ViewStyle;
};

export default function DailyMediaView(props: Props) {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const tracks = [props.videoTrack, props.audioTrack].filter((t) => t);
    const stream = tracks.length > 0 ? new MediaStream(tracks) : null;
    setStream(stream);
  }, [props.videoTrack, props.audioTrack]);

  const rtcView = stream ? (
    <RTCView
      streamURL={stream.toURL()}
      mirror={props.mirror}
      zOrder={props.zOrder}
      objectFit={props.objectFit}
      // on iOS, hide if there's no video track in order to prevent a frozen
      // frame from being displayed. audio playback is unaffected.
      // on Android, hiding is unnecessary since no frozen frame is displayed,
      // and in fact triggers a bug where if it's hidden while in the background
      // it gets "stuck" in the hidden state.
      style={
        props.videoTrack || Platform.OS === 'android'
          ? props.style
          : { display: 'none' }
      }
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
