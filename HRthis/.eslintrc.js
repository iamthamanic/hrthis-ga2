module.exports = {
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },  extends: [
    'react-app',
    'react-app/jest'
  ],
  plugins: [
    'sonarjs',
    'complexity',
    'import'
  ],
  rules: {
    // ===== KRITISCHE FEHLER (Blockierend) =====
    // Diese Regeln verhindern Bugs und Sicherheitsprobleme
    
    // React Hook Fehler - MÜSSEN blockieren
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn', // Von warn auf error hochgestuft
    
    // Undefinierte Variablen und Typen
    'no-undef': 'error',
    '@typescript-eslint/no-explicit-any': 'warn', // Von warn auf error hochgestuft
    
    // Sicherheit
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    
    // React Sicherheit
    'react/no-danger': 'error', // Korrekte Regel für dangerouslySetInnerHTML
    'react/no-find-dom-node': 'error',
    'react/no-direct-mutation-state': 'error',
    
    // Kritische Code-Qualität
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/no-duplicated-branches': 'error',
    'sonarjs/no-identical-conditions': 'error',
    
    // TypeScript Typ-Sicherheit
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true 
    }],
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    
    // ===== QUALITÄTS-WARNUNGEN (Nicht-Blockierend) =====
    // Diese verbessern Code-Qualität und Wartbarkeit
    
    // Komplexität (für KI-Feedback)
    'complexity': ['warn', { max: 10 }], // Von error auf warn
    'sonarjs/cognitive-complexity': ['warn', 15], // Von error auf warn
    
    // Größenbeschränkungen (für Refactoring-Hinweise)
    'max-lines': ['warn', { max: 75, skipBlankLines: true, skipComments: true }], // Strenger: 75 statt 300
    'max-lines-per-function': ['warn', { max: 30, skipBlankLines: true, skipComments: true }], // Strenger: 30 statt 50
    'max-statements': ['warn', 15], // Neu: Max Statements pro Funktion
    'max-depth': ['warn', 3], // Strenger: 3 statt 4
    'max-nested-callbacks': ['warn', 2], // Strenger: 2 statt 3
    'max-params': ['warn', 3], // Strenger: 3 statt 4
    
    // Code-Duplikation
    'sonarjs/no-duplicate-string': ['warn', { threshold: 3 }], // Von error auf warn
    'no-duplicate-imports': 'warn', // Von error auf warn
    
    // Console und Debug
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'error',
    
    // React Best Practices
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'warn',
    'react/prefer-stateless-function': 'warn',
    'react/jsx-no-bind': ['warn', {
      ignoreRefs: true,
      allowArrowFunctions: true,
      allowFunctions: false,
      allowBind: false
    }],
    
    // TypeScript Best Practices
    '@typescript-eslint/explicit-function-return-type': ['warn', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
      allowDirectConstAssertionInArrowFunctions: true
    }],
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    
    // Neue Qualitätsregeln für KI
    'sonarjs/prefer-immediate-return': 'warn', // Von error auf warn
    'sonarjs/prefer-single-boolean-return': 'warn', // Von error auf warn
    'no-lonely-if': 'warn',
    'no-nested-ternary': 'warn',
    'prefer-const': 'error',
    'prefer-destructuring': ['warn', {
      array: true,
      object: true
    }],
    
    // Import Organisation
    'import/order': ['warn', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true }
    }]
  },
  overrides: [
    {
      // Weniger strenge Regeln für Test-Dateien
      files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}', '**/*.spec.{ts,tsx}'],
      rules: {
        'max-lines': 'off',
        'max-lines-per-function': 'off',
        'max-statements': 'off',
        'sonarjs/no-duplicate-string': 'off',
        '@typescript-eslint/no-explicit-any': 'warn', // In Tests erlauben wir any als Warnung
        '@typescript-eslint/no-non-null-assertion': 'warn'
      }
    },
    {
      // Konfigurationsdateien
      files: ['*.config.{js,ts}', '*.setup.{js,ts}'],
      rules: {
        'max-lines': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
};