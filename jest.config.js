module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.tsx', 'src/**/*.ts', '!src/entry.ts'],
  coverageDirectory: './coverage/',
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/config/fileMock.js',
  },
  roots: ['<rootDir>/src/'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!@openshift|@patternfly|@redhat-cloud-services|lodash-es)'],
  setupFilesAfterEnv: ['<rootDir>/setup-react.ts'],
};
