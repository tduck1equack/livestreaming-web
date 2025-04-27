// @ts-check
import { config } from "@repo/eslint-config/base";

export default [
  ...config,
  {
    ignores: ["eslint.config.mjs"],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
