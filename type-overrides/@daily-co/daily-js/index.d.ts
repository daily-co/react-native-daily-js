// Type definitions for react-native-daily-js
// Project: https://github.com/daily-co/react-native-daily-js
// Definitions by: Paul Kompfner <https://github.com/kompfner>

/**
 * --- REACT-NATIVE-SPECIFIC TYPES ---
 */

import {
  MediaStreamTrack,
  MediaDeviceInfo,
  MediaTrackConstraints,
} from '@daily-co/react-native-webrtc';

/**
 * --- DAILY-JS API EXPOSED VIA REACT-NATIVE-DAILY-JS ---
 */

export type DailyLanguage =
  | 'de'
  | 'en'
  | 'fi'
  | 'fr'
  | 'nl'
  | 'no'
  | 'pt'
  | 'pl'
  | 'ru'
  | 'sv'
  | 'es'
  | 'tr'
  | 'it'
  | 'ka'
  | 'jp';

export type DailyLanguageSetting = DailyLanguage | 'user';

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
  | 'participant-counts-updated'
  | 'track-started'
  | 'track-stopped'
  | 'recording-started'
  | 'recording-stopped'
  | 'recording-stats'
  | 'recording-error'
  | 'transcription-started'
  | 'transcription-stopped'
  | 'transcription-error'
  | 'app-message'
  | 'active-speaker-change'
  | 'network-quality-change'
  | 'network-connection'
  | 'error'
  | 'nonfatal-error'
  | 'live-streaming-started'
  | 'live-streaming-stopped'
  | 'live-streaming-error'
  | 'remote-media-player-started'
  | 'remote-media-player-stopped'
  | 'remote-media-player-updated'
  | 'access-state-updated'
  | 'waiting-participant-added'
  | 'waiting-participant-updated'
  | 'waiting-participant-removed'
  | 'available-devices-updated'
  | 'receive-settings-updated';

export type DailyMeetingState =
  | 'new'
  | 'loading'
  | 'loaded'
  | 'joining-meeting'
  | 'joined-meeting'
  | 'left-meeting'
  | 'error';

export type DailyFatalErrorType =
  | 'ejected'
  | 'nbf-room'
  | 'nbf-token'
  | 'exp-room'
  | 'exp-token';

export type DailyNonFatalErrorType = 'remote-media-player-error';

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
  supportsVideoProcessing: boolean;
}

export interface DailyCallOptions {
  url?: string;
  token?: string;
  dailyConfig?: DailyAdvancedConfig;
  subscribeToTracksAutomatically?: boolean;
  reactNativeConfig?: DailyReactNativeConfig;
  videoSource?: string | MediaStreamTrack;
  audioSource?: string | MediaStreamTrack;
  receiveSettings?: DailyReceiveSettings;
  userName?: string;
  userData?: unknown;
}

export interface DailyLoadOptions extends DailyCallOptions {
  baseUrl?: string;
}

export interface CamSimulcastEncoding {
  maxBitrate: number;
  maxFramerate?: number;
  scaleResolutionDownBy?: number;
}

export interface DailyAdvancedConfig {
  camSimulcastEncodings?: CamSimulcastEncoding[];
  experimentalGetUserMediaConstraintsModify?: (constraints: any) => void;
  micAudioMode?: 'music' | 'speech';
  userMediaAudioConstraints?: boolean | MediaTrackConstraints;
  userMediaVideoConstraints?: boolean | MediaTrackConstraints;
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
  subscribed: DailyTrackSubscriptionState;
  state:
    | 'blocked'
    | 'off'
    | 'sendable'
    | 'loading'
    | 'interrupted'
    | 'playable';
  blocked?: {
    byDeviceMissing?: boolean;
    byDeviceInUse?: boolean;
    byPermissions?: boolean;
  };
  off?: {
    byUser?: boolean;
    byRemoteRequest?: boolean;
    byBandwidth?: boolean;
    byCanSendPermission?: boolean;
  };
  track?: MediaStreamTrack;
}

export interface DailyParticipantPermissions {
  hasPresence: boolean;
  canSend:
    | Set<
        | 'video'
        | 'audio'
        | 'screenVideo'
        | 'screenAudio'
        | 'customVideo'
        | 'customAudio'
      >
    | boolean;
}

export type DailyParticipantPermissionsUpdate = {
  [Property in keyof DailyParticipantPermissions]+?: DailyParticipantPermissions[Property];
};

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
  userData?: unknown;
  session_id: string;
  joined_at?: Date;
  will_eject_at: Date;
  local: boolean;
  owner: boolean;
  permissions: DailyParticipantPermissions;
  record: boolean;

  // video element info (iframe-based calls using standard UI only)
  cam_info: {} | DailyVideoElementInfo;
  screen_info: {} | DailyVideoElementInfo;
}

export interface DailyParticipantCounts {
  present: number;
  hidden: number;
}

export interface DailyWaitingParticipant {
  id: string;
  name: string;
  awaitingAccess: SpecifiedDailyAccess;
}

export type DailyTrackSubscriptionState = 'staged' | boolean;

export type DailyTrackSubscriptionOptions =
  | DailyTrackSubscriptionState
  | {
      audio?: DailyTrackSubscriptionState;
      video?: DailyTrackSubscriptionState;
      screenVideo?: DailyTrackSubscriptionState;
      screenAudio?: DailyTrackSubscriptionState;
    };

export interface DailyParticipantUpdateOptions {
  setAudio?: boolean;
  setVideo?: boolean;
  setSubscribedTracks?: DailyTrackSubscriptionOptions;
  eject?: true;
  updatePermissions?: DailyParticipantPermissionsUpdate;
}

export interface DailyWaitingParticipantUpdateOptions {
  grantRequestedAccess?: boolean;
}

export interface DailyVideoElementInfo {
  width: number;
  height: number;
  left: number;
  top: number;
  video_width: number;
  video_height: number;
}

export interface DailyDeviceInfos {
  camera: {} | MediaDeviceInfo;
  mic: {} | MediaDeviceInfo;
  speaker: {} | MediaDeviceInfo;
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
      totalSendPacketLoss: number;
      totalRecvPacketLoss: number;
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
    enable_emoji_reactions?: boolean;
    enable_chat?: boolean;
    enable_knocking?: boolean;
    enable_network_ui?: boolean;
    enable_people_ui?: boolean;
    enable_pip_ui?: boolean;
    enable_hand_raising?: boolean;
    enable_prejoin_ui?: boolean;
    enable_video_processing_ui?: boolean;
    start_video_off?: boolean;
    start_audio_off?: boolean;
    owner_only_broadcast?: boolean;
    audio_only?: boolean;
    enable_recording?: string;
    enable_dialin?: boolean;
    autojoin?: boolean;
    eject_at_room_exp?: boolean;
    eject_after_elapsed?: number;
    lang?: '' | DailyLanguageSetting;
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
    lang?: '' | DailyLanguageSetting;
    max_api_rooms?: number;
    webhook_meeting_end?: any;
    max_live_streams?: number;
    max_streaming_instances_per_room?: number;
    enable_emoji_reactions?: boolean;
    enable_network_ui?: boolean;
    enable_people_ui?: boolean;
    enable_pip_ui?: boolean;
    enable_hand_raising?: boolean;
    enable_prejoin_ui?: boolean;
    enable_video_processing_ui?: boolean;
  };
  tokenConfig: {
    eject_at_token_exp?: boolean;
    eject_after_elapsed?: boolean;
    nbf?: number;
    exp?: number;
    is_owner?: boolean;
    user_name?: string;
    user_id?: string;
    enable_screenshare?: boolean;
    start_video_off?: boolean;
    start_audio_off?: boolean;
    enable_recording?: string;
    start_cloud_recording?: boolean;
    close_tab_on_exit?: boolean;
    redirect_on_meeting_exit?: string;
    lang?: '' | DailyLanguageSetting;
  };
  dialInPIN?: string;
}

export interface DailyVideoReceiveSettings {
  layer?: number;
}
export interface DailySingleParticipantReceiveSettings {
  video?: DailyVideoReceiveSettings;
  screenVideo?: DailyVideoReceiveSettings;
}

export interface DailyReceiveSettings {
  [participantIdOrBase: string]: DailySingleParticipantReceiveSettings;
}

export interface DailyVideoReceiveSettingsUpdates {
  layer?: number | 'inherit';
}

export interface DailySingleParticipantReceiveSettingsUpdates {
  video?: DailyVideoReceiveSettingsUpdates | 'inherit';
  screenVideo?: DailyVideoReceiveSettingsUpdates | 'inherit';
}

export interface DailyReceiveSettingsUpdates {
  [participantIdOrBaseOrStar: string]:
    | DailySingleParticipantReceiveSettingsUpdates
    | 'inherit';
}

export interface DailyEventObjectNoPayload {
  action: Extract<
    DailyEvent,
    | 'loading'
    | 'loaded'
    | 'joining-meeting'
    | 'left-meeting'
    | 'recording-stopped'
    | 'recording-stats'
    | 'recording-error'
    | 'live-streaming-started'
    | 'live-streaming-stopped'
  >;
}

export interface DailyEventObjectFatalError {
  action: Extract<DailyEvent, 'error'>;
  errorMsg: string;
  error?: {
    type: DailyFatalErrorType;
    localizedMsg?: string;
  };
}

export interface DailyEventObjectNonFatalError {
  action: Extract<DailyEvent, 'nonfatal-error'>;
  type: DailyNonFatalErrorType;
  errorMsg: string;
}

export interface DailyEventObjectGenericError {
  action: Extract<
    DailyEvent,
    'load-attempt-failed' | 'live-streaming-error' | 'camera-error'
  >;
  errorMsg: string;
}

export interface DailyEventObjectParticipants {
  action: Extract<DailyEvent, 'joined-meeting'>;
  participants: DailyParticipantsObject;
}

export interface DailyEventObjectParticipant {
  action: Extract<DailyEvent, 'participant-joined' | 'participant-updated'>;
  participant: DailyParticipant;
}

// only 1 reason reported for now. more to come.
export type DailyParticipantLeftReason = 'hidden';

export interface DailyEventObjectParticipantLeft {
  action: Extract<DailyEvent, 'participant-left'>;
  participant: DailyParticipant;
  // reason undefined if participant left for any reason other than those listed
  // in DailyParticipantLeftReason
  reason?: DailyParticipantLeftReason;
}

export interface DailyEventObjectParticipantCounts {
  action: Extract<DailyEvent, 'participant-counts-updated'>;
  participantCounts: DailyParticipantCounts;
}

export interface DailyEventObjectWaitingParticipant {
  action: Extract<
    DailyEvent,
    | 'waiting-participant-added'
    | 'waiting-participant-updated'
    | 'waiting-participant-removed'
  >;
  participant: DailyWaitingParticipant;
}

export interface DailyEventObjectAccessState extends DailyAccessState {
  action: Extract<DailyEvent, 'access-state-updated'>;
}

export interface DailyEventObjectTrack {
  action: Extract<DailyEvent, 'track-started' | 'track-stopped'>;
  participant: DailyParticipant | null; // null if participant left meeting
  track: MediaStreamTrack;
}

export interface DailyEventObjectRecordingStarted {
  action: Extract<DailyEvent, 'recording-started'>;
  local?: boolean;
  recordingId?: string;
  startedBy?: string;
  type?: string;
  layout?: DailyStreamingLayoutConfig;
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

export interface DailyEventObjectReceiveSettingsUpdated {
  action: Extract<DailyEvent, 'receive-settings-updated'>;
  receiveSettings: DailyReceiveSettings;
}

export interface DailyEventObjectAvailableDevicesUpdated {
  action: Extract<DailyEvent, 'available-devices-updated'>;
  availableDevices: MediaDeviceInfo[];
}

export interface DailyEventObjectLiveStreamingStarted {
  action: Extract<DailyEvent, 'live-streaming-started'>;
  layout?: DailyStreamingLayoutConfig;
}

export interface DailyEventObjectTranscriptionStarted {
  action: Extract<DailyEvent, 'transcription-started'>;
  language: string;
  model: string;
  startedBy: string;
}

export interface DailyEventObjectTranscriptionStopped {
  action: Extract<DailyEvent, 'transcription-stopped'>;
  updatedBy: string;
}

export interface DailyEventObjectRemoteMediaPlayerUpdate {
  action: Extract<
    DailyEvent,
    'remote-media-player-started' | 'remote-media-player-updated'
  >;
  updatedBy: string;
  session_id: string;
  remoteMediaPlayerState: DailyRemoteMediaPlayerState;
}

export interface DailyEventObjectRemoteMediaPlayerStopped {
  action: Extract<DailyEvent, 'remote-media-player-stopped'>;
  session_id: string;
  updatedBy: string;
  reason: DailyRemoteMediaPlayerStopReason;
}

export type DailyEventObject<T extends DailyEvent = any> =
  T extends DailyEventObjectAppMessage['action']
    ? DailyEventObjectAppMessage
    : T extends DailyEventObjectNoPayload['action']
    ? DailyEventObjectNoPayload
    : T extends DailyEventObjectFatalError['action']
    ? DailyEventObjectFatalError
    : T extends DailyEventObjectNonFatalError['action']
    ? DailyEventObjectNonFatalError
    : T extends DailyEventObjectGenericError['action']
    ? DailyEventObjectGenericError
    : T extends DailyEventObjectParticipants['action']
    ? DailyEventObjectParticipants
    : T extends DailyEventObjectParticipant['action']
    ? DailyEventObjectParticipant
    : T extends DailyEventObjectParticipantLeft['action']
    ? DailyEventObjectParticipantLeft
    : T extends DailyEventObjectParticipantCounts['action']
    ? DailyEventObjectParticipantCounts
    : T extends DailyEventObjectWaitingParticipant['action']
    ? DailyEventObjectWaitingParticipant
    : T extends DailyEventObjectAccessState['action']
    ? DailyEventObjectAccessState
    : T extends DailyEventObjectTrack['action']
    ? DailyEventObjectTrack
    : T extends DailyEventObjectRecordingStarted['action']
    ? DailyEventObjectRecordingStarted
    : T extends DailyEventObjectRemoteMediaPlayerUpdate['action']
    ? DailyEventObjectRemoteMediaPlayerUpdate
    : T extends DailyEventObjectRemoteMediaPlayerStopped['action']
    ? DailyEventObjectRemoteMediaPlayerStopped
    : T extends DailyEventObjectNetworkQualityEvent['action']
    ? DailyEventObjectNetworkQualityEvent
    : T extends DailyEventObjectNetworkConnectionEvent['action']
    ? DailyEventObjectNetworkConnectionEvent
    : T extends DailyEventObjectActiveSpeakerChange['action']
    ? DailyEventObjectActiveSpeakerChange
    : T extends DailyEventObjectReceiveSettingsUpdated['action']
    ? DailyEventObjectReceiveSettingsUpdated
    : T extends DailyEventObjectAvailableDevicesUpdated['action']
    ? DailyEventObjectAvailableDevicesUpdated
    : any;

export type DailyNativeInCallAudioMode = 'video' | 'voice';

export interface DailyCallFactory {
  createCallObject(properties?: DailyCallOptions): DailyCall;
}

export interface DailyCallStaticUtils {
  supportedBrowser(): DailyBrowserInfo;
}

export type DailyCameraFacingMode = 'user' | 'environment';

export interface DailyStreamingDefaultLayoutConfig {
  preset: 'default';
  max_cam_streams?: number;
}

export interface DailyStreamingSingleParticipantLayoutConfig {
  preset: 'single-participant';
  session_id: string;
}

export interface DailyStreamingActiveParticipantLayoutConfig {
  preset: 'active-participant';
}

export type DailyStreamingPortraitLayoutVariant = 'vertical' | 'inset';

export interface DailyStreamingPortraitLayoutConfig {
  preset: 'portrait';
  variant?: DailyStreamingPortraitLayoutVariant;
  max_cam_streams?: number;
}

export interface DailyStreamingCustomLayoutConfig {
  preset: 'custom';
  composition_id: string;
  composition_params?: {
    [key: string]: boolean | number | string;
  };
  session_assets?: {
    [key: string]: string;
  };
}

export type DailyStreamingLayoutConfig =
  | DailyStreamingDefaultLayoutConfig
  | DailyStreamingSingleParticipantLayoutConfig
  | DailyStreamingActiveParticipantLayoutConfig
  | DailyStreamingPortraitLayoutConfig
  | DailyStreamingCustomLayoutConfig;

export type DailyRemoteMediaPlayerSettingPlay = 'play';
export type DailyRemoteMediaPlayerSettingPause = 'pause';

export type DailyRemoteMediaPlayerStatePlaying = 'playing';
export type DailyRemoteMediaPlayerStatePaused = 'paused';
export type DailyRemoteMediaPlayerStateBuffering = 'buffering';

export type DailyRemoteMediaPlayerEOS = 'EOS';
export type DailyRemoteMediaPlayerPeerStopped = 'stopped-by-peer';

export type DailyRemoteMediaPlayerStopReason =
  | DailyRemoteMediaPlayerEOS
  | DailyRemoteMediaPlayerPeerStopped;

export type DailyAccess = 'unknown' | SpecifiedDailyAccess;

export type SpecifiedDailyAccess = { level: 'none' | 'lobby' | 'full' };

export type DailyAccessState = {
  access: DailyAccess;
  awaitingAccess?: SpecifiedDailyAccess;
};

export type DailyAccessRequest = {
  access?: { level: 'full' };
  name: string;
};

export interface DailyStreamingOptions {
  width?: number;
  height?: number;
  fps?: number;
  backgroundColor?: string;
  layout?: DailyStreamingLayoutConfig;
}

export interface DailyStreamingEndpoint {
  endpoint: string;
}

export interface DailyLiveStreamingOptions extends DailyStreamingOptions {
  rtmpUrl?: string | string[];
  endpoints?: DailyStreamingEndpoint[];
}

export interface RemoteMediaPlayerSimulcastEncoding {
  maxBitrate: number;
  maxFramerate?: number;
  scaleResolutionDownBy?: number;
}

export interface DailyRemoteMediaPlayerSettings {
  state: DailyRemoteMediaPlayerSettingPlay | DailyRemoteMediaPlayerSettingPause;
  simulcastEncodings?: RemoteMediaPlayerSimulcastEncoding[];
}

export interface DailyRemoteMediaPlayerStartOptions {
  url: string;
  settings?: DailyRemoteMediaPlayerSettings;
}

export interface DailyRemoteMediaPlayerUpdateOptions {
  session_id: string;
  settings: DailyRemoteMediaPlayerSettings;
}

export interface DailyRemoteMediaPlayerState {
  state:
    | DailyRemoteMediaPlayerStatePlaying
    | DailyRemoteMediaPlayerStatePaused
    | DailyRemoteMediaPlayerStateBuffering;
  settings: DailyRemoteMediaPlayerSettings;
}

export interface DailyRemoteMediaPlayerInfo {
  session_id: string;
  remoteMediaPlayerState: DailyRemoteMediaPlayerState;
}

export interface DailyTranscriptionDeepgramOptions {
  language?: string;
  model?: string;
}

export interface DailyCall {
  join(properties?: DailyCallOptions): Promise<DailyParticipantsObject | void>;
  leave(): Promise<void>;
  destroy(): Promise<void>;
  meetingState(): DailyMeetingState;
  accessState(): DailyAccessState;
  participants(): DailyParticipantsObject;
  participantCounts(): DailyParticipantCounts;
  updateParticipant(
    sessionId: string,
    updates: DailyParticipantUpdateOptions
  ): DailyCall;
  updateParticipants(updates: {
    [sessionId: string]: DailyParticipantUpdateOptions;
  }): DailyCall;
  waitingParticipants(): { [id: string]: DailyWaitingParticipant };
  updateWaitingParticipant(
    id: string,
    updates: DailyWaitingParticipantUpdateOptions
  ): Promise<{ id: string }>;
  updateWaitingParticipants(updates: {
    [id: string]: DailyWaitingParticipantUpdateOptions;
  }): Promise<{ ids: string[] }>;
  requestAccess(
    access: DailyAccessRequest
  ): Promise<{ access: DailyAccess; granted: boolean }>;
  localAudio(): boolean;
  localVideo(): boolean;
  setLocalAudio(enabled: boolean): DailyCall;
  setLocalVideo(enabled: boolean): DailyCall;
  getReceiveSettings(
    id: string,
    options?: { showInheritedValues: boolean }
  ): Promise<DailySingleParticipantReceiveSettings>;
  getReceiveSettings(): Promise<DailyReceiveSettings>;
  updateReceiveSettings(
    receiveSettings: DailyReceiveSettingsUpdates
  ): Promise<DailyReceiveSettings>;
  startCamera(properties?: DailyCallOptions): Promise<void>;
  cycleCamera(): Promise<{
    device: { facingMode: DailyCameraFacingMode } | null;
  }>;
  setCamera(cameraDeviceId: string | number): Promise<{
    device: { facingMode: DailyCameraFacingMode } | null;
  }>;
  setAudioDevice(deviceId: string): Promise<{
    deviceId: string;
  }>;
  getCameraFacingMode(): Promise<DailyCameraFacingMode | null>;
  nativeInCallAudioMode(): DailyNativeInCallAudioMode;
  setNativeInCallAudioMode(
    inCallAudioMode: DailyNativeInCallAudioMode
  ): DailyCall;
  getInputDevices(): Promise<DailyDeviceInfos>;
  startLiveStreaming(options: DailyLiveStreamingOptions): void;
  updateLiveStreaming(options: { layout?: DailyStreamingLayoutConfig }): void;
  addLiveStreamingEndpoints(options: {
    endpoints: DailyStreamingEndpoint[];
  }): void;
  removeLiveStreamingEndpoints(options: {
    endpoints: DailyStreamingEndpoint[];
  }): void;
  stopLiveStreaming(): void;
  startRemoteMediaPlayer(
    options: DailyRemoteMediaPlayerStartOptions
  ): Promise<DailyRemoteMediaPlayerInfo>;
  stopRemoteMediaPlayer(session_id: string): Promise<void>;
  updateRemoteMediaPlayer(
    options: DailyRemoteMediaPlayerUpdateOptions
  ): Promise<DailyRemoteMediaPlayerInfo>;
  startTranscription(options?: DailyTranscriptionDeepgramOptions): void;
  stopTranscription(): void;
  preAuth(properties?: DailyCallOptions): Promise<{ access: DailyAccess }>;
  load(properties?: DailyLoadOptions): Promise<void>;
  startRecording(options?: DailyStreamingOptions): void;
  updateRecording(options: { layout?: DailyStreamingLayoutConfig }): void;
  stopRecording(): void;
  getNetworkStats(): Promise<DailyNetworkStats>;
  subscribeToTracksAutomatically(): boolean;
  setSubscribeToTracksAutomatically(enabled: boolean): DailyCall;
  enumerateDevices(): Promise<{ devices: MediaDeviceInfo[] }>;
  sendAppMessage(data: any, to?: string): DailyCall;
  setUserName(name: string): Promise<{ userName: string }>;
  setUserData(data: unknown): Promise<{ userData: unknown }>;
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
