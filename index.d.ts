/**
 * Unfortunately it looks like we *manually* have to maintain this type
 * declaration file in order to export the *modified* RN-specific daily-js
 * types.
 *
 * Relying on TypeScript's automatic declaration generation via the
 * "declaration" property in tsconfig.json results in the original
 * (browser-specific) daily-js types being exported.
 */
import DailyIframe from './type-overrides/@daily-co/daily-js';
import 'react-native-url-polyfill/auto';
import DailyMediaView from './src/DailyMediaView';

export default DailyIframe;
export * from './type-overrides/@daily-co/daily-js';
export { DailyMediaView };
export * from 'react-native-webrtc';
