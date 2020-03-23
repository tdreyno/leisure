module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/require-await": 0,
    semi: ["error", "never"],
    "@typescript-eslint/member-delimiter-style": 0,
  },
}
