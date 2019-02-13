const sgDefault = require('@shopgate/pwa-unit-test/jest.config');

// No spread here please. Spread makes jest init terribly slow!.
module.exports = Object.assign({}, sgDefault, {
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!jest.config.js',
    '!.eslintrc.js',
  ],
});
