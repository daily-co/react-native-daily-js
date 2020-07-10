import * as React from 'react';
import { useEffect, useState } from 'react';
import { ViewStyle, View, NativeModules } from 'react-native';
import {
  MediaStreamTrack,
  RTCView,
  MediaStream,
  RTCViewProps,
} from 'react-native-webrtc';

const { DailyNativeUtils } = NativeModules;

function useMediaPlayRegistration(track: MediaStreamTrack | null) {
  useEffect(() => {
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
  const [stream, setStream] = useState<MediaStream | null>(null);
  useMediaPlayRegistration(props.videoTrack);
  useMediaPlayRegistration(props.audioTrack);

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
