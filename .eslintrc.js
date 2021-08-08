module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["google", "prettier"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    semi: 1,
    "max-len": ["warn", { code: 120 }],
    "prettier/prettier": ["error"],
  },
};
