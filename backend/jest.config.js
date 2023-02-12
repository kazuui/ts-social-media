/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["<rootDir>/src/tests/testSetup.ts"],
  setupFilesAfterEnv: ['<rootDir>/singleton.ts']
};