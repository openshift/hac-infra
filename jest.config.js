module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.tsx', 'src/**/*.ts', '!src/entry.ts'],
  coverageDirectory: './coverage/',
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  roots: ['<rootDir>/src/'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!@redhat-cloud-services)', '/node_modules/(?!@patternfly)'],
};
