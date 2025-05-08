module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/unit/**/*.test.ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/server.ts",
    "!src/config/**/*.ts",
    "!src/docs/**/*.ts",
    "!src/interfaces/**/*.ts",
    "!src/dtos/**/*.ts",
    "!src/schemas/**/*.ts",
  ],
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testTimeout: 10000,
};
