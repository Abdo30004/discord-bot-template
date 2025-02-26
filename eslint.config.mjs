import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import ts from '@typescript-eslint/eslint-plugin';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';


export default [
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': ts,
      'simple-import-sort': pluginSimpleImportSort
    },
    languageOptions: {
      globals: {
        ...globals.node
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      ...ts.configs.recommended.rules,
      semi: 'warn', // Warns if semicolons are missing
      camelcase: 'warn', // Warns if variables are not in camelCase
      eqeqeq: 'error', // Enforces strict equality (=== and !==) instead of loose equality (== and !=)
      'no-var': 'warn', // Warns against using 'var' (prefer 'let' or 'const')
      'no-implied-eval': 'error', // Prevents usage of implied eval() via setTimeout or setInterval
      'require-await': 'off', // Allows async functions without an explicit 'await'
      'no-return-await': 'error', // Disallows unnecessary return await
      'no-eval': 'error', // Disallows use of eval(), which can be a security risk
      complexity: 'warn', // Warns if functions have high complexity (too many branches/logic paths)
      'prefer-const': 'warn', // Warns when 'let' is used but could be 'const'
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'none' // Ignores unused function arguments to reduce noise
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn', // Warns against using 'any' type in TypeScript
      '@typescript-eslint/no-empty-function': 'off', // Allows empty functions (useful in some cases like stubs)
      'simple-import-sort/imports': 'error' // Enforces sorted imports to improve readability
    }
  },
  {
    files: ['**/.eslintrc.{js,cjs}'],

    languageOptions: {
      globals: {
        ...globals.node
      },

      ecmaVersion: 5,
      sourceType: 'commonjs'
    }
  }
];
