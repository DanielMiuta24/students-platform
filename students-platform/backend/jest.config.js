module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    'src/tests/modules/auth/',
    'src/tests/shared/',
    'src/tests/integration/',
    'src/tests/modules/user/user.controller.spec.ts',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/tests/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
};
