import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Existing admin/content models are intentionally JSON-shaped. Keep the
      // type debt visible without blocking production validation.
      "@typescript-eslint/no-explicit-any": "warn",
      // Turkish editorial copy frequently contains apostrophes and quotes.
      "react/no-unescaped-entities": "warn",
      // These are follow-up refactors, not production build blockers.
      "react-hooks/set-state-in-effect": "warn",
      "@next/next/no-html-link-for-pages": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "master-content/**",
  ]),
]);

export default eslintConfig;
