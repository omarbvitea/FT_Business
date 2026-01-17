import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            import: importPlugin,
        },
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
            },
        },
        rules: {
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        ['parent', 'sibling'],
                        'index',
                        'object',
                        'type',
                    ],
                    pathGroups: [
                        {
                            pattern: '@/**',
                            group: 'internal',
                            position: 'before',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                    'newlines-between': 'always',
                },
            ],
            'import/no-duplicates': 'error',
            'import/extensions': [
                'error',
                'never',
                {
                    js: 'never',
                    ts: 'never',
                    json: 'always',
                },
            ],
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['../**', './**'],
                            message: 'Please use @/ alias instead of relative imports.',
                        },
                    ],
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
    },
)
