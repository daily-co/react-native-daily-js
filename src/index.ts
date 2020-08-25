import DailyIframe from '@daily-co/daily-js';
import { registerGlobals } from '@daily-co/react-native-webrtc';
import DailyMediaView from './DailyMediaView';
import iOSCallObjectBundleCache from './iOSCallObjectBundleCache';
import 'react-native-url-polyfill/auto'; // Applies global URL polyfill
import BackgroundTimer from 'react-native-background-timer';
import { Platform, NativeModules } from 'react-native';
const { DailyNativeUtils, WebRTCModule } = NativeModules;

declare const global: any;

function setupGlobals() {
  // WebRTC APIs + global `window` object
  registerGlobals();

  // A shim to prevent errors in call machine bundle (not ideal)
  global.window.addEventListener = () => {};

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
    setAudioMode: WebRTCModule.setDailyAudioMode,
  };
}

setupGlobals();

export default DailyIframe;
export * from '@daily-co/daily-js';
export { DailyMediaView };
export * from '@daily-co/react-native-webrtc';
