module.exports = {
  root: true,
  extends: ["./packages/config/eslint-preset.js"],
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "dist/",
    "build/",
    "coverage/",
    "*.config.js",
    "*.config.ts",
  ],
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
      env: {
        jest: true,
      },
      extends: ["plugin:testing-library/react"],
    },
  ],
};
