module.exports = {
  rootDir: './',
  moduleFileExtensions: ['js', 'ts'],
  moduleDirectories: ['node_modules', 'src'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts}',
    '!**/*.config.js',
  ],
  coverageDirectory: 'coverage',
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
      tsConfig: 'tsconfig.jest.json',
    },
  },
  testRegex: ['/__tests__/.*\\.(ts)$', '/*.test\\.(ts)$'],
}
