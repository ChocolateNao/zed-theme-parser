/** @type {import('eslint').Linter.Config} */

import { defineConfig } from 'eslint/config';
import { default as rootConfig } from '../../eslint.config.mjs';

export default defineConfig([
  {
    extends: [rootConfig],
    languageOptions: {
      parserOptions: {
        projectService: {
          defaultProject: 'tsconfig.json',
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    ignores: ['dist/**/*', '*.mjs', 'node_modules'],
    rules: {
      '@typescript-eslint/require-await': 'off',
      'no-console': 'off', // CLI needs console output
      '@typescript-eslint/no-unsafe-assignment': 'warn',
    },
  },
]);
