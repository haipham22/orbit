import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/server/**/*.ts"],
    rules: {
      // src/server dùng chung với Temporal worker — worker process không có next/*
      "no-restricted-imports": [
        "error",
        { patterns: [{ group: ["next", "next/*"], message: "src/server phải pure Node, cấm import next/*" }] },
      ],
    },
  },
]);

export default eslintConfig;
