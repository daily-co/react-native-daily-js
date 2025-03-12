module.exports = {
  testMatch: ['**/__tests__/**/*.test.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@daily-co/react-native-webrtc)/)',
  ],
  setupFiles: [
    '<rootDir>/jest.setup.js',
  ],
  // Environment setup
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // Handle modules with native dependencies
  moduleNameMapper: {
    '^react-native$': require.resolve('react-native'),
  },
  // Mock modules that are problematic in test environment
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
}; 