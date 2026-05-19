module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[jt]sx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.json',
      },
    ],
  },
  // Do not skip transformation for async-storage-v3: its mock is ESM-only
  // and must be compiled to CJS by ts-jest before Jest can require() it.
  transformIgnorePatterns: ['/node_modules/(?!(async-storage-v3)/)'],
};
