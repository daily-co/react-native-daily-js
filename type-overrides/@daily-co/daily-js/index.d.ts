// Type definitions for react-native-daily-js
// Project: https://github.com/daily-co/react-native-daily-js
// Definitions by: Paul Kompfner <https://github.com/kompfner>

/**
 * --- REACT-NATIVE-SPECIFIC TYPES ---
 */

import { MediaStreamTrack } from '@daily-co/react-native-webrtc';

/**
 * --- DAILY-JS API EXPOSED VIA REACT-NATIVE-DAILY-JS ---
 */

export type DailyLanguage =
  | 'de'
  | 'en'
  | 'fi'
  | 'fr'
  | 'nl'
  | 'pt'
  | 'pl'
  | 'sv'
  | 'es'
  | 'tr'
  | 'it'
  | 'ka'
  | 'jp'
  | 'user';

export type DailyEvent =
  | 'loading'
  | 'load-attempt-failed'
  | 'loaded'
  | 'started-camera'
  | 'camera-error'
  | 'joining-meeting'
  | 'joined-meeting'
  | 'left-meeting'
  | 'participant-joined'
  | 'participant-updated'
  | 'participant-left'
  | 'track-started'
  | 'track-stopped'
  | 'recording-started'
  | 'recording-stopped'
  | 'app-message'
  | 'active-speaker-change'
  | 'network-quality-change'
  | 'network-connection'
  | 'error'
  | 'live-streaming-started'
  | 'live-streaming-stopped'
  | 'live-streaming-error';

export type DailyMeetingState =
  | 'new'
  | 'loading'
  | 'loaded'
  | 'joining-meeting'
  | 'joined-meeting'
  | 'left-meeting'
  | 'error';

export interface DailyParticipantsObject {
  local: DailyParticipant;
  [id: string]: DailyParticipant;
}

export interface DailyBrowserInfo {
  supported: boolean;
  mobile: boolean;
  name: string;
  version: string;
  supportsScreenShare: boolean;
  supportsSfu: boolean;
}

export interface DailyCallOptions {
  url?: string;
  token?: string;
  dailyConfig?: DailyAdvancedConfig;
  reactNativeConfig?: DailyReactNativeConfig;
  videoSource?: string | MediaStreamTrack;
  audioSource?: string | MediaStreamTrack;
}

export interface DailyLoadOptions extends DailyCallOptions {
  baseUrl?: string;
}

export interface DailyAdvancedConfig {
  experimentalGetUserMediaConstraintsModify?: (constraints: any) => void;
  preferH264ForCam?: boolean;
  h264Profile?: string;
}

export interface DailyReactNativeConfig {
  androidInCallNotification?: {
    title?: string;
    subtitle?: string;
    iconName?: string;
    disableForCustomOverride?: boolean;
  };
  disableAutoDeviceManagement?: {
    audio?: boolean;
    video?: boolean;
  };
}

export interface DailyTrackState {
  subscribed: boolean;
  state:
    | 'blocked'
    | 'off'
    | 'sendable'
    | 'loading'
    | 'interrupted'
    | 'playable';
  blocked?: {
    byDeviceMissing?: boolean;
    byPermissions?: boolean;
  };
  off?: {
    byUser?: boolean;
    byBandwidth?: boolean;
  };
  track?: MediaStreamTrack;
}

export interface DailyParticipant {
  // tracks
  audioTrack?: MediaStreamTrack;
  videoTrack?: MediaStreamTrack;
  screenVideoTrack?: MediaStreamTrack;
  screenAudioTrack?: MediaStreamTrack;

  // legacy track state
  audio: boolean;
  video: boolean;
  screen: boolean;

  // new track state
  tracks: {
    audio: DailyTrackState;
    video: DailyTrackState;
    screenAudio: DailyTrackState;
    screenVideo: DailyTrackState;
  };

  // user/session info
  user_id: string;
  user_name: string;
  session_id: string;
  joined_at: Date;
  will_eject_at: Date;
  local: boolean;
  owner: boolean;
  record: boolean;

  // video element info (iframe-based calls using standard UI only)
  cam_info: {} | DailyVideoElementInfo;
  screen_info: {} | DailyVideoElementInfo;
}

export type DailyTrackSubscriptionOptions =
  | boolean
  | {
      audio?: boolean;
      video?: boolean;
      screenVideo?: boolean;
      screenAudio?: boolean;
    };

export interface DailyParticipantUpdateOptions {
  setAudio?: boolean;
  setVideo?: boolean;
  setSubscribedTracks?: DailyTrackSubscriptionOptions;
  eject?: true;
}

export interface DailyVideoElementInfo {
  width: number;
  height: number;
  left: number;
  top: number;
  video_width: number;
  video_height: number;
}

export interface DailyNetworkStats {
  quality: number;
  stats: {
    latest: {
      recvBitsPerSecond: number;
      sendBitsPerSecond: number;
      timestamp: number;
      videoRecvBitsPerSecond: number;
      videoRecvPacketLoss: number;
      videoSendBitsPerSecond: number;
      videoSendPacketLoss: number;
    };
    worstVideoRecvPacketLoss: number;
    worstVideoSendPacketLoss: number;
  };
  threshold: 'good' | 'low' | 'very-low';
}

export interface DailyPendingRoomInfo {
  roomUrlPendingJoin: string;
}

export interface DailyRoomInfo {
  id: string;
  name: string;
  config: {
    nbf?: number;
    exp?: number;
    max_participants?: number;
    enable_screenshare?: boolean;
    enable_chat?: boolean;
    enable_knocking?: boolean;
    start_video_off?: boolean;
    start_audio_off?: boolean;
    owner_only_broadcast?: boolean;
    audio_only?: boolean;
    enable_recording?: string;
    enable_dialin?: boolean;
    autojoin?: boolean;
    eject_at_room_exp?: boolean;
    eject_after_elapsed?: number;
    lang?: '' | DailyLanguage;
    sfu_switchover?: number;
    signaling_impl?: string;
    geo?: string;
  };
  domainConfig: {
    hide_daily_branding?: boolean;
    redirect_on_meeting_exit?: string;
    hipaa?: boolean;
    sfu_impl?: string;
    signaling_impl?: string;
    sfu_switchover?: number;
    lang?: '' | DailyLanguage;
    max_api_rooms?: number;
    webhook_meeting_end?: any;
    max_live_streams?: number;
  };
  dialInPIN?: string;
}

export interface DailyEventObjectNoPayload {
  action: Extract<
    DailyEvent,
    | 'loading'
    | 'loaded'
    | 'joining-meeting'
    | 'left-meeting'
    | 'recording-started'
    | 'recording-stopped'
    | 'live-streaming-started'
    | 'live-streaming-stopped'
  >;
}

export interface DailyEventErrorObject {
  action: Extract<
    DailyEvent,
    'load-attempt-failed' | 'live-streaming-error' | 'error'
  >;
  errorMsg: string;
}

export interface DailyEventObjectParticipants {
  action: Extract<DailyEvent, 'joined-meeting'>;
  participants: DailyParticipantsObject;
}

export interface DailyEventObjectParticipant {
  action: Extract<
    DailyEvent,
    'participant-joined' | 'participant-updated' | 'participant-left'
  >;
  participant: DailyParticipant;
}

export interface DailyEventObjectTrack {
  action: Extract<DailyEvent, 'track-started' | 'track-stopped'>;
  participant: DailyParticipant | null; // null if participant left meeting
  track: MediaStreamTrack;
}

export interface DailyEventObjectNetworkQualityEvent {
  action: Extract<DailyEvent, 'network-quality-change'>;
  threshold: string;
  quality: number;
}

export type DailyNetworkConnectionType = 'signaling' | 'peer-to-peer' | 'sfu';

export interface DailyEventObjectNetworkConnectionEvent {
  action: Extract<DailyEvent, 'network-connection'>;
  type: DailyNetworkConnectionType;
  event: string;
  session_id?: string;
  sfu_id?: string;
}

export interface DailyEventObjectActiveSpeakerChange {
  action: Extract<DailyEvent, 'active-speaker-change'>;
  activeSpeaker: {
    peerId: string;
  };
}

export interface DailyEventObjectAppMessage {
  action: Extract<DailyEvent, 'app-message'>;
  data: any;
  fromId: string;
}

export type DailyEventObject<
  T extends DailyEvent = any
> = T extends DailyEventObjectAppMessage['action']
  ? DailyEventObjectAppMessage
  : T extends DailyEventObjectNoPayload['action']
  ? DailyEventObjectNoPayload
  : T extends DailyEventErrorObject['action']
  ? DailyEventErrorObject
  : T extends DailyEventObjectParticipants['action']
  ? DailyEventObjectParticipants
  : T extends DailyEventObjectParticipant['action']
  ? DailyEventObjectParticipant
  : T extends DailyEventObjectTrack['action']
  ? DailyEventObjectTrack
  : T extends DailyEventObjectNetworkQualityEvent['action']
  ? DailyEventObjectNetworkQualityEvent
  : T extends DailyEventObjectNetworkConnectionEvent['action']
  ? DailyEventObjectNetworkConnectionEvent
  : T extends DailyEventObjectActiveSpeakerChange['action']
  ? DailyEventObjectActiveSpeakerChange
  : any;

export type DailyNativeInCallAudioMode = 'video' | 'voice';

export interface DailyCallFactory {
  createCallObject(properties?: DailyCallOptions): DailyCall;
}

export interface DailyCallStaticUtils {
  supportedBrowser(): DailyBrowserInfo;
}

export type DailyCameraFacingMode = 'user' | 'environment';

export interface DailyCall {
  join(properties?: DailyCallOptions): Promise<DailyParticipantsObject | void>;
  leave(): Promise<void>;
  destroy(): Promise<void>;
  meetingState(): DailyMeetingState;
  participants(): DailyParticipantsObject;
  updateParticipant(
    sessionId: string,
    updates: DailyParticipantUpdateOptions
  ): DailyCall;
  updateParticipants(updates: {
    [sessionId: string]: DailyParticipantUpdateOptions;
  }): DailyCall;
  localAudio(): boolean;
  localVideo(): boolean;
  setLocalAudio(enabled: boolean): DailyCall;
  setLocalVideo(enabled: boolean): DailyCall;
  startCamera(properties?: DailyCallOptions): Promise<void>;
  cycleCamera(): Promise<{
    device: { facingMode: DailyCameraFacingMode } | null;
  }>;
  getCameraFacingMode(): Promise<DailyCameraFacingMode | null>;
  nativeInCallAudioMode(): DailyNativeInCallAudioMode;
  setNativeInCallAudioMode(
    inCallAudioMode: DailyNativeInCallAudioMode
  ): DailyCall;
  load(properties?: DailyLoadOptions): Promise<void>;
  getNetworkStats(): Promise<DailyNetworkStats>;
  subscribeToTracksAutomatically(): boolean;
  setSubscribeToTracksAutomatically(enabled: boolean): DailyCall;
  sendAppMessage(data: any, to?: string): DailyCall;
  setUserName(name: string): Promise<{ userName: string }>;
  room(options?: {
    includeRoomConfigDefaults: boolean;
  }): Promise<DailyPendingRoomInfo | DailyRoomInfo | null>;
  geo(): Promise<{ current: string }>;
  on<T extends DailyEvent>(
    event: T,
    handler: (event?: DailyEventObject<T>) => void
  ): DailyCall;
  once<T extends DailyEvent>(
    event: T,
    handler: (event?: DailyEventObject<T>) => void
  ): DailyCall;
  off<T extends DailyEvent>(
    event: T,
    handler: (event?: DailyEventObject<T>) => void
  ): DailyCall;
  properties: {
    dailyConfig?: DailyAdvancedConfig;
  };
}

declare const DailyIframe: DailyCallFactory & DailyCallStaticUtils;

export default DailyIframe;
