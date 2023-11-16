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
  MediaStream,
} from '@daily-co/react-native-webrtc';

import RTCRtpEncodingParameters from '@daily-co/react-native-webrtc/lib/typescript/RTCRtpEncodingParameters';

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
  | 'call-instance-destroyed'
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
  | 'local-screen-share-started'
  | 'local-screen-share-stopped'
  | 'active-speaker-change'
  | 'network-quality-change'
  | 'network-connection'
  | 'cpu-load-change'
  | 'error'
  | 'nonfatal-error'
  | 'live-streaming-started'
  | 'live-streaming-updated'
  | 'live-streaming-stopped'
  | 'live-streaming-error'
  | 'remote-media-player-started'
  | 'remote-media-player-stopped'
  | 'remote-media-player-updated'
  | 'access-state-updated'
  | 'meeting-session-state-updated'
  | 'waiting-participant-added'
  | 'waiting-participant-updated'
  | 'waiting-participant-removed'
  | 'available-devices-updated'
  | 'receive-settings-updated'
  | 'send-settings-updated';

export type DailyMeetingState =
  | 'new'
  | 'loading'
  | 'loaded'
  | 'joining-meeting'
  | 'joined-meeting'
  | 'left-meeting'
  | 'error';

export type DailyCameraErrorType =
  | 'cam-in-use'
  | 'mic-in-use'
  | 'cam-mic-in-use'
  | 'permissions'
  | 'undefined-mediadevices'
  | 'not-found'
  | 'constraints'
  | 'unknown';

export type DailyFatalErrorType =
  | 'ejected'
  | 'nbf-room'
  | 'nbf-token'
  | 'exp-room'
  | 'exp-token'
  | 'no-room'
  | 'meeting-full'
  | 'end-of-life'
  | 'not-allowed'
  | 'connection-error';

export type DailyNonFatalErrorType =
  | 'screen-share-error'
  | 'remote-media-player-error'
  | 'live-streaming-warning'
  | 'meeting-session-data-error';

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
  supportsAudioProcessing: boolean;
}

export interface DailyCallOptions {
  url?: string;
  token?: string;
  dailyConfig?: DailyAdvancedConfig;
  subscribeToTracksAutomatically?: boolean;
  reactNativeConfig?: DailyReactNativeConfig;
  videoSource?: string | MediaStreamTrack | boolean;
  audioSource?: string | MediaStreamTrack | boolean;
  receiveSettings?: DailyReceiveSettings;
  sendSettings?: DailySendSettings;
  userName?: string;
  userData?: unknown;
  startVideoOff?: boolean;
  startAudioOff?: boolean;
}

export interface DailyLoadOptions extends DailyCallOptions {
  baseUrl?: string;
}

export interface DailyFactoryOptions extends DailyCallOptions {
  strictMode?: boolean; // only available at constructor time
}

export interface CamSimulcastEncoding {
  maxBitrate: number;
  maxFramerate?: number;
  scaleResolutionDownBy?: number;
}

/* These types are not defined inside react-native-webrtc, so we need to define them here in order to use */
type RTCIceTransportPolicy = 'all' | 'relay';
type RTCIceCredentialType = 'password';
interface RTCIceServer {
  credential?: string;
  credentialType?: RTCIceCredentialType;
  urls: string | string[];
  username?: string;
}

export interface DailyIceConfig {
  iceServers?: RTCIceServer[];
  placement?: 'front' | 'back' | 'replace';
  iceTransportPolicy?: RTCIceTransportPolicy;
}

export interface DailyAdvancedConfig {
  /**
   * @deprecated This property will be removed. Instead, use sendSettings, which is found in DailyCallOptions.
   */
  camSimulcastEncodings?: CamSimulcastEncoding[];
  v2CamAndMic?: boolean;
  experimentalGetUserMediaConstraintsModify?: (constraints: any) => void;
  micAudioMode?: 'music' | 'speech';
  userMediaAudioConstraints?: MediaTrackConstraints;
  userMediaVideoConstraints?: MediaTrackConstraints;
  preferH264ForCam?: boolean;
  h264Profile?: string;
  proxyUrl?: string;
  iceConfig?: DailyIceConfig;
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
    byServerLimit?: boolean;
  };
  // guaranteed-playable reference to the track
  // (it's only present when state === 'playable')
  track?: MediaStreamTrack;
  // not-guaranteed-playable reference to the track
  // (it may be present when state !== 'playable')
  persistentTrack?: MediaStreamTrack;
}

export type DailyParticipantPermissionsCanSendValues =
  | 'video'
  | 'audio'
  | 'screenVideo'
  | 'screenAudio'
  | 'customVideo'
  | 'customAudio';

export type DailyParticipantPermissionsCanAdminValues =
  | 'participants'
  | 'streaming'
  | 'transcription';

export interface DailyParticipantPermissions {
  hasPresence: boolean;
  canSend: Set<DailyParticipantPermissionsCanSendValues> | boolean;
  canAdmin: Set<DailyParticipantPermissionsCanAdminValues> | boolean;
}

export type DailyParticipantPermissionsUpdate = {
  hasPresence?: boolean;
  canSend?:
    | Array<DailyParticipantPermissionsCanSendValues>
    | Set<DailyParticipantPermissionsCanSendValues>
    | boolean;
  canAdmin?:
    | Array<DailyParticipantPermissionsCanAdminValues>
    | Set<DailyParticipantPermissionsCanAdminValues>
    | boolean;
};

export interface DailyParticipantTracks {
  audio: DailyTrackState;
  video: DailyTrackState;
  screenAudio: DailyTrackState;
  screenVideo: DailyTrackState;
}

export interface DailyParticipant {
  /**
   * @deprecated This property will be removed. Use tracks.audio.persistentTrack instead.
   */
  audioTrack?: MediaStreamTrack | false;
  /**
   * @deprecated This property will be removed. Use tracks.video.persistentTrack instead.
   */
  videoTrack?: MediaStreamTrack | false;
  /**
   * @deprecated This property will be removed. Use tracks.screenVideo.persistentTrack instead.
   */
  screenVideoTrack?: MediaStreamTrack | false;
  /**
   * @deprecated This property will be removed. Use tracks.screenAudio.persistentTrack instead.
   */
  screenAudioTrack?: MediaStreamTrack | false;

  /**
   * @deprecated This property will be removed. Use tracks.audio.state instead.
   */
  audio: boolean;
  /**
   * @deprecated This property will be removed. Use tracks.video.state instead.
   */
  video: boolean;
  /**
   * @deprecated This property will be removed. Use tracks.screenVideo.state instead.
   */
  screen: boolean;

  // track state
  tracks: DailyParticipantTracks & {
    [customTrackKey: string]: DailyTrackState;
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
  /**
   * @deprecated This property will be removed. Refer to tracks.video instead.
   */
  cam_info: {} | DailyVideoElementInfo;
  /**
   * @deprecated This property will be removed. Refer to tracks.screenVideo instead.
   */
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

export type DailyCustomTrackSubscriptionState =
  | DailyTrackSubscriptionState
  | { [name: string]: DailyTrackSubscriptionState };

export type DailyTrackSubscriptionOptions =
  | DailyTrackSubscriptionState
  | {
      audio?: DailyTrackSubscriptionState;
      video?: DailyTrackSubscriptionState;
      screenVideo?: DailyTrackSubscriptionState;
      screenAudio?: DailyTrackSubscriptionState;
      custom?: DailyCustomTrackSubscriptionState;
    };

export interface DailyParticipantUpdateOptions {
  setAudio?: boolean;
  setVideo?: boolean;
  setScreenShare?: false;
  setSubscribedTracks?: DailyTrackSubscriptionOptions;
  eject?: true;
  updatePermissions?: DailyParticipantPermissionsUpdate;
}

export interface DailyWaitingParticipantUpdateOptions {
  grantRequestedAccess?: boolean;
}

/**
 * @deprecated
 * All properties will be removed as cam_info and screen_info are also deprecated.
 * Use the participants() object's tracks property to retrieve track information instead.
 * e.g. call.participants()['participant-id'].tracks.video.persistentTrack.getSettings()
 */
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

export interface DailyStartScreenShare {
  //RN does not support any displayMediaOptions, that is why we have not added the definition here
  screenVideoSendSettings?:
    | DailyVideoSendSettings
    | DailyScreenVideoSendSettingsPreset;
}

export interface DailyNetworkStats {
  quality: number;
  stats: {
    latest: {
      timestamp: number;
      recvBitsPerSecond: number | null;
      sendBitsPerSecond: number | null;
      networkRoundTripTime: number | null;
      videoRecvBitsPerSecond: number | null;
      videoSendBitsPerSecond: number | null;
      audioRecvBitsPerSecond: number | null;
      audioSendBitsPerSecond: number | null;
      videoRecvPacketLoss: number | null;
      videoSendPacketLoss: number | null;
      audioRecvPacketLoss: number | null;
      audioSendPacketLoss: number | null;
      totalSendPacketLoss: number | null;
      totalRecvPacketLoss: number | null;
      videoRecvJitter: number | null;
      videoSendJitter: number | null;
      audioRecvJitter: number | null;
      audioSendJitter: number | null;
    };
    worstVideoRecvPacketLoss: number;
    worstVideoSendPacketLoss: number;
    worstAudioRecvPacketLoss: number;
    worstAudioSendPacketLoss: number;
    worstVideoRecvJitter: number;
    worstVideoSendJitter: number;
    worstAudioRecvJitter: number;
    worstAudioSendJitter: number;
    averageNetworkRoundTripTime: number | null;
  };
  threshold: 'good' | 'low' | 'very-low';
}

export interface DailyCpuLoadStats {
  cpuLoadState: 'low' | 'high';
  cpuLoadStateReason: 'encode' | 'decode' | 'scheduleDuration' | 'none'; // We are currently not using the Inter frame Delay to change the cpu load state
  stats: {
    latest: {
      timestamp: number;
      scheduleDuration: number;
      frameEncodeTimeSec: number;
      targetEncodeFrameRate: number;
      targetDecodeFrameRate: number;
      targetScheduleDuration: number;
      cpuUsageBasedOnTargetEncode: number;
      cpuUsageBasedOnGlobalDecode: number;
      avgFrameDecodeTimeSec: number;
      avgInterFrameDelayStandardDeviation: number;
      totalReceivedVideoTracks: number;
      cpuInboundVideoStats: {
        trackId: string;
        ssrc: number;
        frameWidth: number;
        frameHeight: number;
        fps: number;
        frameDecodeTimeSec: number;
        interFrameDelayStandardDeviation: number;
      }[];
    };
  };
}

interface DailySendSettings {
  video?: DailyVideoSendSettings | DailyVideoSendSettingsPreset;
  customVideoDefaults?: DailyVideoSendSettings | DailyVideoSendSettingsPreset;
  [customKey: string]:
    | DailyVideoSendSettings
    | DailyVideoSendSettingsPreset
    | undefined;
}

export type DailyVideoSendSettingsPreset =
  | 'default'
  | 'bandwidth-optimized'
  | 'quality-optimized';

// Media Track Send Settings
interface DailyVideoSendSettings {
  maxQuality?: 'low' | 'medium' | 'high';
  encodings?: {
    low: RTCRtpEncodingParameters;
    medium: RTCRtpEncodingParameters;
    high: RTCRtpEncodingParameters;
  };
}

export type DailyScreenVideoSendSettingsPreset =
  | 'default-screen-video'
  | 'detail-optimized'
  | 'motion-optimized'
  | 'motion-and-detail-balanced';

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
    enable_breakout_rooms?: boolean;
    enable_emoji_reactions?: boolean;
    enable_chat?: boolean;
    enable_knocking?: boolean;
    enable_network_ui?: boolean;
    enable_noise_cancellation_ui?: boolean;
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
    enable_breakout_rooms?: boolean;
    enable_emoji_reactions?: boolean;
    enable_network_ui?: boolean;
    enable_noise_cancellation_ui?: boolean;
    enable_people_ui?: boolean;
    enable_pip_ui?: boolean;
    enable_hand_raising?: boolean;
    enable_prejoin_ui?: boolean;
    enable_video_processing_ui?: boolean;
  };
  tokenConfig: {
    eject_at_token_exp?: boolean;
    eject_after_elapsed?: number;
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

export interface DailyMeetingSessionSummary {
  id: string;
}

export interface DailyMeetingSessionState {
  data: unknown;
}

export type DailySessionDataMergeStrategy = 'replace' | 'shallow-merge';

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
    | 'call-instance-destroyed'
    | 'recording-stats'
  >;
}

export type DailyCameraError = {
  msg: string;
};

export interface DailyCamPermissionsError extends DailyCameraError {
  type: Extract<DailyCameraErrorType, 'permissions'>;
  blockedBy: 'user' | 'browser';
  blockedMedia: Array<'video' | 'audio'>;
}

export interface DailyCamDeviceNotFoundError extends DailyCameraError {
  type: Extract<DailyCameraErrorType, 'not-found'>;
  missingMedia: Array<'video' | 'audio'>;
}

export interface DailyCamConstraintsError extends DailyCameraError {
  type: Extract<DailyCameraErrorType, 'constraints'>;
  reason: 'invalid' | 'none-specified';
}

export interface DailyCamInUseError extends DailyCameraError {
  type: Extract<
    DailyCameraErrorType,
    'cam-in-use' | 'mic-in-use' | 'cam-mic-in-use'
  >;
}

export interface DailyCamTypeError extends DailyCameraError {
  type: Extract<DailyCameraErrorType, 'undefined-mediadevices'>;
}

export interface DailyCamUnknownError extends DailyCameraError {
  type: Extract<DailyCameraErrorType, 'unknown'>;
}

export type DailyCameraErrorObject<T extends DailyCameraErrorType> =
  T extends DailyCamPermissionsError['type']
    ? DailyCamPermissionsError
    : T extends DailyCamDeviceNotFoundError['type']
    ? DailyCamDeviceNotFoundError
    : T extends DailyCamConstraintsError['type']
    ? DailyCamConstraintsError
    : T extends DailyCamInUseError['type']
    ? DailyCamInUseError
    : T extends DailyCamTypeError['type']
    ? DailyCamTypeError
    : T extends DailyCamUnknownError['type']
    ? DailyCamUnknownError
    : any;

export interface DailyEventObjectCameraError {
  action: Extract<DailyEvent, 'camera-error'>;
  errorMsg: {
    errorMsg: string;
    audioOk?: boolean;
    videoOk?: boolean;
  };
  error: DailyCameraErrorObject<DailyCameraErrorType>;
}

export type DailyFatalError = {
  type: DailyFatalErrorType;
  msg: string;
};

export interface DailyFatalConnectionError extends DailyFatalError {
  type: Extract<DailyFatalErrorType, 'connection-error'>;
  details: {
    on: 'load' | 'join' | 'reconnect' | 'move';
    sourceError: Error;
    uri?: string;
    workerGroup?: string;
    geoGroup?: string;
    bundleUrl?: string;
  };
}

export type DailyFatalErrorObject<T extends DailyFatalErrorType> =
  T extends DailyFatalConnectionError['type'] ? DailyFatalConnectionError : any;

export interface DailyEventObjectFatalError {
  action: Extract<DailyEvent, 'error'>;
  errorMsg: string;
  error?: DailyFatalErrorObject<DailyFatalErrorType>;
}

export interface DailyEventObjectNonFatalError {
  action: Extract<DailyEvent, 'nonfatal-error'>;
  type: DailyNonFatalErrorType;
  errorMsg: string;
  details?: any;
}

export interface DailyEventObjectGenericError {
  action: Extract<DailyEvent, 'load-attempt-failed'>;
  errorMsg: string;
}

export interface DailyEventObjectLiveStreamingError {
  action: Extract<DailyEvent, 'live-streaming-error'>;
  errorMsg: string;
  instanceId?: string;
  actionTraceId?: string;
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

export interface DailyEventObjectMeetingSessionSummaryUpdated {
  action: Extract<DailyEvent, 'meeting-session-summary-updated'>;
  meetingSession: DailyMeetingSessionSummary;
}

export interface DailyEventObjectMeetingSessionStateUpdated {
  action: Extract<DailyEvent, 'meeting-session-state-updated'>;
  meetingSessionState: DailyMeetingSessionState;
}

export interface DailyEventObjectTrack {
  action: Extract<DailyEvent, 'track-started' | 'track-stopped'>;
  participant: DailyParticipant | null; // null if participant left meeting
  track: MediaStreamTrack;
  type:
    | 'video'
    | 'audio'
    | 'screenVideo'
    | 'screenAudio'
    | 'rmpVideo'
    | 'rmpAudio'
    | string; // string - for custom tracks
}

export interface DailyEventObjectRecordingStarted {
  action: Extract<DailyEvent, 'recording-started'>;
  local?: boolean;
  recordingId?: string;
  startedBy?: string;
  type?: string;
  layout?: DailyStreamingLayoutConfig<'start'>;
  instanceId?: string;
}

export interface DailyEventObjectRecordingStopped {
  action: Extract<DailyEvent, 'recording-stopped'>;
  instanceId?: string;
}

export interface DailyEventObjectRecordingError {
  action: Extract<DailyEvent, 'recording-error'>;
  errorMsg: string;
  instanceId?: string;
  actionTraceId?: string;
}

export interface DailyEventObjectNetworkQualityEvent {
  action: Extract<DailyEvent, 'network-quality-change'>;
  threshold: string;
  quality: number;
}

export interface DailyEventObjectCpuLoadEvent {
  action: Extract<DailyEvent, 'cpu-load-change'>;
  cpuLoadState: 'low' | 'high';
  cpuLoadStateReason: 'encode' | 'decode' | 'scheduleDuration' | 'none'; // We are currently not using the Inter frame Delay to change the cpu load state
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

export interface DailyEventObjectSendSettingsUpdated {
  action: Extract<DailyEvent, 'send-settings-updated'>;
  sendSettings: DailySendSettings;
}

export interface DailyEventObjectLiveStreamingStarted {
  action: Extract<DailyEvent, 'live-streaming-started'>;
  layout?: DailyLiveStreamingLayoutConfig<'start'>;
  instanceId?: string;
}
export interface DailyEventObjectLiveStreamingUpdated {
  action: Extract<DailyEvent, 'live-streaming-updated'>;
  endpoint?: DailyStreamingEndpoint;
  state: DailyStreamingState;
  instanceId?: string;
}

export interface DailyEventObjectLiveStreamingStopped {
  action: Extract<DailyEvent, 'live-streaming-stopped'>;
  instanceId?: string;
}

export interface DailyEventObjectTranscriptionStarted {
  action: Extract<DailyEvent, 'transcription-started'>;
  transcriptId?: string;
  language: string;
  model: string;
  tier?: string;
  detect_language?: boolean;
  profanity_filter?: boolean;
  redact?: Array<string> | boolean;
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
    : T extends DailyEventObjectCameraError['action']
    ? DailyEventObjectCameraError
    : T extends DailyEventObjectFatalError['action']
    ? DailyEventObjectFatalError
    : T extends DailyEventObjectNonFatalError['action']
    ? DailyEventObjectNonFatalError
    : T extends DailyEventObjectGenericError['action']
    ? DailyEventObjectGenericError
    : T extends DailyEventObjectParticipants['action']
    ? DailyEventObjectParticipants
    : T extends DailyEventObjectLiveStreamingStarted['action']
    ? DailyEventObjectLiveStreamingStarted
    : T extends DailyEventObjectLiveStreamingUpdated['action']
    ? DailyEventObjectLiveStreamingUpdated
    : T extends DailyEventObjectLiveStreamingStopped['action']
    ? DailyEventObjectLiveStreamingStopped
    : T extends DailyEventObjectLiveStreamingError['action']
    ? DailyEventObjectLiveStreamingError
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
    : T extends DailyEventObjectMeetingSessionStateUpdated['action']
    ? DailyEventObjectMeetingSessionStateUpdated
    : T extends DailyEventObjectTrack['action']
    ? DailyEventObjectTrack
    : T extends DailyEventObjectRecordingStarted['action']
    ? DailyEventObjectRecordingStarted
    : T extends DailyEventObjectRecordingStopped['action']
    ? DailyEventObjectRecordingStopped
    : T extends DailyEventObjectRecordingError['action']
    ? DailyEventObjectRecordingError
    : T extends DailyEventObjectRemoteMediaPlayerUpdate['action']
    ? DailyEventObjectRemoteMediaPlayerUpdate
    : T extends DailyEventObjectRemoteMediaPlayerStopped['action']
    ? DailyEventObjectRemoteMediaPlayerStopped
    : T extends DailyEventObjectNetworkQualityEvent['action']
    ? DailyEventObjectNetworkQualityEvent
    : T extends DailyEventObjectCpuLoadEvent['action']
    ? DailyEventObjectCpuLoadEvent
    : T extends DailyEventObjectNetworkConnectionEvent['action']
    ? DailyEventObjectNetworkConnectionEvent
    : T extends DailyEventObjectActiveSpeakerChange['action']
    ? DailyEventObjectActiveSpeakerChange
    : T extends DailyEventObjectReceiveSettingsUpdated['action']
    ? DailyEventObjectReceiveSettingsUpdated
    : T extends DailyEventObjectAvailableDevicesUpdated['action']
    ? DailyEventObjectAvailableDevicesUpdated
    : T extends DailyEventObjectSendSettingsUpdated['action']
    ? DailyEventObjectSendSettingsUpdated
    : any;

export type DailyNativeInCallAudioMode = 'video' | 'voice';

export interface DailyCallFactory {
  createCallObject(properties?: DailyFactoryOptions): DailyCall;
  getCallInstance(): DailyCall | undefined;
}

export interface DailyCallStaticUtils {
  supportedBrowser(): DailyBrowserInfo;
}

export type DailyCameraFacingMode = 'user' | 'environment';

type DailyStreamingParticipantsSortMethod = 'active';

export interface DailyStreamingParticipantsConfig {
  video?: string[];
  audio?: string[];
  sort?: DailyStreamingParticipantsSortMethod;
}

export interface DailyStreamingDefaultLayoutConfig
  extends DailyStreamingParticipantsConfig {
  preset: 'default';
  max_cam_streams?: number;
}

export interface DailyStreamingSingleParticipantLayoutConfig {
  preset: 'single-participant';
  session_id: string;
}

export interface DailyStreamingActiveParticipantLayoutConfig
  extends DailyStreamingParticipantsConfig {
  preset: 'active-participant';
}

export interface DailyStreamingAudioOnlyLayoutConfig {
  preset: 'audio-only';
}

export type DailyStreamingPortraitLayoutVariant = 'vertical' | 'inset';

export interface DailyStreamingPortraitLayoutConfig
  extends DailyStreamingParticipantsConfig {
  preset: 'portrait';
  variant?: DailyStreamingPortraitLayoutVariant;
  max_cam_streams?: number;
}

export interface DailyUpdateStreamingCustomLayoutConfig
  extends DailyStreamingParticipantsConfig {
  preset: 'custom';
  composition_params?: {
    [key: string]: boolean | number | string;
  };
}

export interface DailyStartStreamingCustomLayoutConfig
  extends DailyUpdateStreamingCustomLayoutConfig,
    DailyStreamingParticipantsConfig {
  composition_id?: string;
  session_assets?: {
    [key: string]: string;
  };
}

type DailyStreamingLayoutConfigType = 'start' | 'update';
type DailyStartStreamingMethod = 'liveStreaming' | 'recording';

export type DailyStreamingLayoutConfig<
  Type extends DailyStreamingLayoutConfigType = 'start'
> =
  | DailyStreamingDefaultLayoutConfig
  | DailyStreamingSingleParticipantLayoutConfig
  | DailyStreamingActiveParticipantLayoutConfig
  | DailyStreamingPortraitLayoutConfig
  | DailyStreamingAudioOnlyLayoutConfig
  | (Type extends 'start'
      ? DailyStartStreamingCustomLayoutConfig
      : DailyUpdateStreamingCustomLayoutConfig);

export type DailyLiveStreamingLayoutConfig<
  Type extends DailyStreamingLayoutConfigType = 'start'
> = Exclude<
  DailyStreamingLayoutConfig<Type>,
  DailyStreamingAudioOnlyLayoutConfig
>;

export type DailyStreamingState = 'connected' | 'interrupted';

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

export interface DailyStreamingOptions<
  Method extends DailyStartStreamingMethod,
  Type extends DailyStreamingLayoutConfigType = 'start'
> {
  width?: number;
  height?: number;
  fps?: number;
  videoBitrate?: number;
  audioBitrate?: number;
  minIdleTimeOut?: number;
  maxDuration?: number;
  backgroundColor?: string;
  instanceId?: string;
  layout?: Method extends 'recording'
    ? DailyStreamingLayoutConfig<Type>
    : DailyLiveStreamingLayoutConfig<Type>;
}

export interface DailyStreamingEndpoint {
  endpoint: string;
}

export interface DailyLiveStreamingOptions<
  Type extends DailyStreamingLayoutConfigType = 'start'
> extends DailyStreamingOptions<'liveStreaming', Type> {
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
  tier?: string;
  profanity_filter?: boolean;
  redact?: Array<string> | boolean;
}

export interface DailyCall {
  join(properties?: DailyCallOptions): Promise<DailyParticipantsObject | void>;
  leave(): Promise<void>;
  destroy(): Promise<void>;
  isDestroyed(): boolean;
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
  startRecording(options?: DailyStreamingOptions<'recording', 'start'>): void;
  updateRecording(options: {
    layout?: DailyStreamingLayoutConfig<'update'>;
    instanceId?: string;
  }): void;
  stopRecording(options?: { instanceId: string }): void;
  startLiveStreaming(options: DailyLiveStreamingOptions<'start'>): void;
  updateLiveStreaming(options: {
    layout?: DailyLiveStreamingLayoutConfig<'update'>;
    instanceId?: string;
  }): void;
  addLiveStreamingEndpoints(options: {
    endpoints: DailyStreamingEndpoint[];
    instanceId?: string;
  }): void;
  removeLiveStreamingEndpoints(options: {
    endpoints: DailyStreamingEndpoint[];
    instanceId?: string;
  }): void;
  stopLiveStreaming(options?: { instanceId: string }): void;
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
  startScreenShare(properties?: DailyStartScreenShare): void;
  stopScreenShare(): void;
  getNetworkStats(): Promise<DailyNetworkStats>;
  getCpuLoadStats(): Promise<DailyCpuLoadStats>;
  updateSendSettings(settings: DailySendSettings): Promise<DailySendSettings>;
  getSendSettings(): DailySendSettings;
  subscribeToTracksAutomatically(): boolean;
  setSubscribeToTracksAutomatically(enabled: boolean): DailyCall;
  enumerateDevices(): Promise<{ devices: MediaDeviceInfo[] }>;
  sendAppMessage(data: any, to?: string | string[]): DailyCall;
  setProxyUrl(proxyUrl?: string): DailyCall;
  setIceConfig(iceConfig?: DailyIceConfig): DailyCall;
  meetingSessionSummary(): DailyMeetingSessionSummary;
  meetingSessionState(): DailyMeetingSessionState;
  setMeetingSessionData(
    data: unknown,
    mergeStrategy?: DailySessionDataMergeStrategy
  ): void;
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

declare const Daily: DailyCallFactory & DailyCallStaticUtils;

export default Daily;
