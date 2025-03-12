/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug.legacy': {
      type: 'ios.app',
      binaryPath: 'TestApp/ios/build/Build/Products/Debug-iphonesimulator/TestApp.app',
      build: 'cd TestApp/ios && xcodebuild -workspace TestApp.xcworkspace -scheme TestApp -configuration Debug -sdk iphonesimulator -derivedDataPath build -arch x86_64 REACT_NATIVE_ARCH=legacy',
    },
    'ios.debug.new': {
      type: 'ios.app',
      binaryPath: 'TestApp/ios/build/Build/Products/Debug-iphonesimulator/TestApp.app',
      build: 'cd TestApp/ios && xcodebuild -workspace TestApp.xcworkspace -scheme TestApp -configuration Debug -sdk iphonesimulator -derivedDataPath build -arch x86_64 REACT_NATIVE_ARCH=new',
    },
    'android.debug.legacy': {
      type: 'android.apk',
      binaryPath: 'TestApp/android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd TestApp/android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug -PREACT_NATIVE_ARCH=legacy',
    },
    'android.debug.new': {
      type: 'android.apk',
      binaryPath: 'TestApp/android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd TestApp/android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug -PREACT_NATIVE_ARCH=new',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_API_33',
      },
    },
  },
  configurations: {
    'ios.legacy': {
      device: 'simulator',
      app: 'ios.debug.legacy',
    },
    'ios.new': {
      device: 'simulator',
      app: 'ios.debug.new',
    },
    'android.legacy': {
      device: 'emulator',
      app: 'android.debug.legacy',
    },
    'android.new': {
      device: 'emulator',
      app: 'android.debug.new',
    },
  },
}; 