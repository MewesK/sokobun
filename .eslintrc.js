module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'simple-import-sort'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    env: {
        browser: true,
        node: true
    },
    rules: {
        'simple-import-sort/sort': 'error'
    }
};
