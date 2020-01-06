module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/lib/',
  ],
  transform: {
    '\\.(ts)$': 'ts-jest',
  },
  setupFiles: ['./config/setup-jest.js'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  testRegex: ['/__tests__/.*\\.(ts)$', '/*.test\\.(ts)$'],
}
