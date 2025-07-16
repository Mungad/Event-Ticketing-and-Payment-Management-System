import type {Config} from 'jest';

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
   coveragePathIgnorePatterns: [
  "/node_modules/",
  "src/drizzle.db.ts",
  "src/drizzle/schema.ts",
  "src/mailer/email.service.ts",
],
testTimeout: 20000,
};

export default config;