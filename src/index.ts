import Daily from '@daily-co/daily-js';
import { registerGlobals } from '@daily-co/react-native-webrtc';
import DailyMediaView from './DailyMediaView';
import iOSCallObjectBundleCache from './iOSCallObjectBundleCache';
import 'react-native-url-polyfill/auto'; // Applies global URL polyfill
import BackgroundTimer from 'react-native-background-timer';
import { encode as btoa, decode as atob } from 'base-64';
import {
  Platform,
  NativeModules,
  NativeEventEmitter,
  AppState,
  AppStateStatus,
} from 'react-native';
// Preventing RN issue getrandomvalues not supported
// https://github.com/uuidjs/uuid#getrandomvalues-not-supported
import 'react-native-get-random-values';
const { DailyNativeUtils, WebRTCModule } = NativeModules;

declare const global: any;

const webRTCEventEmitter = new NativeEventEmitter(WebRTCModule);
const dailyNativeUtilsEventEmitter = new NativeEventEmitter(DailyNativeUtils);

let hasAudioFocus: boolean;
let appState: AppStateStatus;
const audioFocusChangeListeners: Set<(hasFocus: boolean) => void> = new Set();
const appActiveStateChangeListeners: Set<(isActive: boolean) => void> =
  new Set();
const systemScreenCaptureStopListeners: Set<() => void> = new Set();
let systemScreenCaptureStartCallback: { (): void } | null;

function setupEventListeners() {
  // audio focus: used by daily-js to auto-mute mic, for instance
  if (Platform.OS === 'android') {
    hasAudioFocus = true; // safe assumption, hopefully
    webRTCEventEmitter.addListener('EventAudioFocusChange', (event) => {
      if (!event || typeof event.hasFocus !== 'boolean') {
        console.error('invalid EventAudioFocusChange event');
      }
      const hadAudioFocus = hasAudioFocus;
      hasAudioFocus = event.hasFocus;
      if (hadAudioFocus !== hasAudioFocus) {
        audioFocusChangeListeners.forEach((listener) =>
          listener(hasAudioFocus)
        );
      }
    });
  }

  // app active state: used by daily-js to auto-mute cam, for instance
  appState = AppState.currentState;
  AppState.addEventListener('change', (nextState) => {
    const previousState = appState;
    appState = nextState;
    const wasActive = previousState === 'active';
    const isActive = appState === 'active';
    if (wasActive !== isActive) {
      appActiveStateChangeListeners.forEach((listener) => listener(isActive));
    }
  });

  if (Platform.OS === 'ios') {
    // screen capture stop: used to synchronize JS screen sharing state with iOS
    // system screen capture state, which can be controlled outside the app via
    // the control center or by tapping the notification in the corner.
    dailyNativeUtilsEventEmitter.addListener(
      'EventSystemScreenCaptureStop',
      () => {
        systemScreenCaptureStopListeners.forEach((listener) => listener());
      }
    );
    // when we invoke to start the screen share, we first invoke to start the screen capture
    // and add the listener, so we are only going to start the screen share if the capture has started
    // that is why we just need a single callback
    dailyNativeUtilsEventEmitter.addListener(
      'EventSystemScreenCaptureStart',
      () => {
        if (systemScreenCaptureStartCallback) {
          systemScreenCaptureStartCallback();
        }
      }
    );
  }
}

function setupGlobals(): void {
  // WebRTC APIs + global `window` object
  registerGlobals();

  // A shim to prevent errors in call machine bundle (not ideal)
  global.window.addEventListener = () => {};
  global.btoa = btoa;
  global.atob = atob;

  // A workaround for iOS HTTP cache not caching call object bundle due to size
  if (Platform.OS === 'ios') {
    global.iOSCallObjectBundleCache = iOSCallObjectBundleCache;
  }

  // Let timers run while Android app is in the background.
  // See https://github.com/jitsi/jitsi-meet/blob/caabdadf19ae5def3f8173acec6c49111f50a04e/react/features/mobile/polyfills/browser.js#L409,
  // where this technique was borrowed from.
  // For now we don't need this for iOS since we're recommending that apps use
  // the "voip" background mode capability, which keeps the app running normally
  // during a call.
  if (Platform.OS === 'android') {
    global.clearTimeout = BackgroundTimer.clearTimeout.bind(BackgroundTimer);
    global.clearInterval = BackgroundTimer.clearInterval.bind(BackgroundTimer);
    global.setInterval = BackgroundTimer.setInterval.bind(BackgroundTimer);
    global.setTimeout = (fn: () => void, ms = 0) =>
      BackgroundTimer.setTimeout(fn, ms);
  }

  global.DailyNativeUtils = {
    ...DailyNativeUtils,
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    setAudioMode: WebRTCModule.setDailyAudioMode,
    setAudioDevice: WebRTCModule.setAudioDevice,
    getAudioDevice: WebRTCModule.getAudioDevice,
    enableNoOpRecordingEnsuringBackgroundContinuity:
      WebRTCModule.enableNoOpRecordingEnsuringBackgroundContinuity,
    addAudioFocusChangeListener: (listener: (hasFocus: boolean) => void) => {
      audioFocusChangeListeners.add(listener);
    },
    removeAudioFocusChangeListener: (listener: (hasFocus: boolean) => void) => {
      audioFocusChangeListeners.delete(listener);
    },
    addAppActiveStateChangeListener: (
      listener: (isActive: boolean) => void
    ) => {
      appActiveStateChangeListeners.add(listener);
    },
    removeAppActiveStateChangeListener: (
      listener: (isActive: boolean) => void
    ) => {
      appActiveStateChangeListeners.delete(listener);
    },
    addSystemScreenCaptureStopListener: (listener: () => void) => {
      systemScreenCaptureStopListeners.add(listener);
    },
    removeSystemScreenCaptureStopListener: (listener: () => void) => {
      systemScreenCaptureStopListeners.delete(listener);
    },
    setSystemScreenCaptureStartCallback: (listener: () => void) => {
      systemScreenCaptureStartCallback = listener;
    },
    platform: Platform,
  };
}

function maybeCreatePromiseAnyPolyfill() {
  // Support to Promise.any has only been introduced on RN 0.70.6
  // https://github.com/facebook/react-native/releases/tag/v0.70.6
  // As spec: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
  // The Promise.any() static method takes an iterable of promises as input and returns a single Promise.
  // This returned promise fulfills when any of the input's promises fulfills, with this first fulfillment value.
  // It rejects when all of the input's promises reject (including when an empty iterable is passed)
  if (!Promise.any) {
    Promise.any = function <T extends readonly unknown[] | []>(
      promises: T
    ): Promise<Awaited<T[number]>> {
      return new Promise((resolve, reject) => {
        let errors: any[] = [];
        promises.forEach((promise) =>
          Promise.resolve(promise)
            .then((value: any) => {
              resolve(value);
            })
            .catch((error) => {
              errors.push(error);
              if (errors.length === promises.length) {
                reject(errors);
              }
            })
        );
      });
    };
  }
}

setupEventListeners();
setupGlobals();
maybeCreatePromiseAnyPolyfill();

export default Daily;
export * from '@daily-co/daily-js';
export { DailyMediaView };
export * from '@daily-co/react-native-webrtc';
