import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['**/out/**', '**/dist/**', '**/build/**', '**/node_modules/**'] },
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-extra-semi': 'off',
      '@typescript-eslint/no-extra-semi': 0,
      '@typescript-eslint/no-unused-vars': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-non-null-assertion': 0,
      'no-constant-condition': 0,
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      indent: ['error', 2, { SwitchCase: 1 }],
      'comma-dangle': ['error', 'only-multiline'],
      'arrow-parens': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
    },
  },
];
