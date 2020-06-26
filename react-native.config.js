module.exports = {
  dependency: {
    platforms: {
      ios: {
        project: './ios/DailyJs.xcodeproj',
      },
      android: {
        sourceDir: './android',
      },
      // Uncomment the below (and point to the right place, and comment the
      // above) during development to enable editing react-native-daily-js's
      // native Android files directly in DailyPlayground without having to
      // reinstall the npm package. Unfortunately the path must be relative.
      // android: {
      //   sourceDir: '../../../../../pluot-core/react-native-daily-js/android/',
      // },
    },
  },
};
