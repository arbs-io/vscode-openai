import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/out/**'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
);
