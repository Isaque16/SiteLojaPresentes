import { Config } from 'jest';
import { createDefaultPreset } from 'ts-jest';

/** @type {import("jest").Config} **/
const config: Config = {
  testEnvironment: 'node',
  ...createDefaultPreset(),
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};

export default config;
