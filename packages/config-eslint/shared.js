/** Rules shared by every workspace. */
export const sharedRules = {
  "@typescript-eslint/no-unused-vars": [
    "error",
    { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
  ],
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
  "no-console": ["error", { allow: ["warn", "error"] }],
};

export const ignores = {
  ignores: [
    "**/.next/**",
    "**/node_modules/**",
    "**/.turbo/**",
    "**/dist/**",
    "**/next-env.d.ts",
    "**/playwright-report/**",
    "**/test-results/**",
  ],
};
