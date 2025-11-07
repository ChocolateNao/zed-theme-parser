/** @type {import('eslint').Linter.Config} */

import { defineConfig } from 'eslint/config';
import { default as rootConfig } from '../../eslint.config.mjs';

export default defineConfig([
  {
    extends: [rootConfig],
    ignores: ['dist/**/*', '*.mjs', 'node_modules'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
    },
  },
]);
