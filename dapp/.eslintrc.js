module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint/eslint-plugin", "jest", "prettier"],
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"],
      },
    },
  },
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "import/prefer-default-export": "off",
    "jest/no-identical-title": "error",
    "import/extensions": "off",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "no-useless-constructor": "off",
    "class-methods-use-this": "off",
    "@typescript-eslint/no-empty-function": "off",
    "no-restricted-syntax": "off",
    "no-underscore-dangle": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "no-console": ["error", { allow: ["warn", "error"] }],
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
    "no-alert": "off",
  },
};
