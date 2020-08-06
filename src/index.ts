import DailyIframe from '@daily-co/daily-js';
import { registerGlobals } from '@daily-co/react-native-webrtc';
import DailyMediaView from './DailyMediaView';
import iOSCallObjectBundleCache from './iOSCallObjectBundleCache';
import 'react-native-url-polyfill/auto'; // Applies global URL polyfill
import { Platform, NativeModules } from 'react-native';
const { DailyNativeUtils } = NativeModules;

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

  global.DailyNativeUtils = DailyNativeUtils;
}

setupGlobals();

export default DailyIframe;
export * from '@daily-co/daily-js';
export { DailyMediaView };
export * from '@daily-co/react-native-webrtc';
