module.exports = {
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  extends: [
    'react-app',
    'react-app/jest',
    'eslint:all' // Strict configuration
  ],
  plugins: [
    'sonarjs',
    'complexity',
    'import'
  ],
  rules: {
    // === STRICT RULES (All Errors) ===
    
    // TypeScript strict mode
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    
    // Code quality strict
    'complexity': ['error', { max: 5 }], // Very strict complexity
    'sonarjs/cognitive-complexity': ['error', 8], // Very strict cognitive complexity
    'max-lines': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': ['error', { max: 20, skipBlankLines: true, skipComments: true }],
    'max-statements': ['error', 10],
    'max-depth': ['error', 2],
    'max-nested-callbacks': ['error', 1],
    'max-params': ['error', 2],
    
    // Security strict
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'react/no-danger': 'error',
    
    // Code duplication strict
    'sonarjs/no-duplicate-string': ['error', { threshold: 2 }],
    'no-duplicate-imports': 'error',
    
    // Disable some eslint:all rules that are too strict for React/TS
    'no-ternary': 'off',
    'no-nested-ternary': 'error',
    'no-magic-numbers': ['error', { ignore: [0, 1, -1] }],
    'one-var': ['error', 'never'],
    'func-style': ['error', 'expression'],
    'prefer-named-capture-group': 'off',
    'require-unicode-regexp': 'off',
    'sort-keys': 'off',
    'sort-imports': 'off',
    'id-length': ['error', { min: 2, max: 30 }],
    'no-undefined': 'off', // TypeScript handles this
    'init-declarations': 'off',
    'no-inline-comments': 'error',
    'line-comment-position': ['error', { position: 'above' }],
    'multiline-comment-style': ['error', 'starred-block'],
    'spaced-comment': ['error', 'always'],
    'capitalized-comments': 'off',
    
    // React specific strict
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'error',
    'react/prefer-stateless-function': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error'
  },
  overrides: [
    {
      // Less strict for test files
      files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}', '**/*.spec.{ts,tsx}'],
      rules: {
        'max-lines': 'off',
        'max-lines-per-function': 'off',
        'max-statements': 'off',
        'sonarjs/no-duplicate-string': 'off',
        '@typescript-eslint/no-explicit-any': 'warn'
      }
    }
  ]
};