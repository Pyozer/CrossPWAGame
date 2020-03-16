module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    extends: [
        "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    parserOptions: {
        // allows for the parsing of modern ecmascript features
        ecmaVersion: 2019,
        // allows for the use of imports
        sourceType: 'module',
    },
    env: {
        browser: true,
        es6: true
    },
    rules: {
        "@typescript-eslint/no-namespace": "off",
        "quotes": ['error', 'single', { avoidEscape: true }],
        "indent": ["error", 4],
        "semi": "off",
        "semi-spacing": ["error", { "before": false, "after": true }],
        "@typescript-eslint/semi": ["warn", "always"],
        "no-extra-semi": "error",
        "no-else-return": ["error", { "allowElseIf": false }],
        "no-useless-return": "error",
        "no-return-await": "error",
        "curly": ["error", "multi-line"],
        "dot-notation": ["error", { allowKeywords: true }],
        "eqeqeq": ["error", "always", { null: "ignore" }],
        "no-iterator": "error",
        "no-lone-blocks": "error",
        "no-param-reassign": ["error", {
            props: true,
            ignorePropertyModificationsFor: [
                "req", // for Express requests
                "request", // for Express requests
                "res", // for Express responses
                "response", // for Express responses
                "err" // for catchError
            ]
        }],
        'prefer-template': 'error',
        "camelcase": ['error', { properties: 'never', ignoreDestructuring: false }],
        'capitalized-comments': ['off', 'never', {
            line: {
                ignorePattern: '.*',
                ignoreInlineComments: true,
                ignoreConsecutiveComments: true,
            },
            block: {
                ignorePattern: '.*',
                ignoreInlineComments: true,
                ignoreConsecutiveComments: true,
            },
        }],
        "comma-dangle": ["error", "never"],
        'comma-style': ['error', 'last', {
            exceptions: {
                ArrayExpression: false,
                ArrayPattern: false,
                ArrowFunctionExpression: false,
                CallExpression: false,
                FunctionDeclaration: false,
                FunctionExpression: false,
                ImportDeclaration: false,
                ObjectExpression: false,
                ObjectPattern: false,
                VariableDeclaration: false,
                NewExpression: false,
            }
        }],
        'object-curly-newline': ['error', {
            ObjectExpression: { minProperties: 4, multiline: true, consistent: true },
            ObjectPattern: { minProperties: 4, multiline: true, consistent: true },
            ImportDeclaration: { multiline: false },
            ExportDeclaration: { minProperties: 4, multiline: true, consistent: true },
        }],
    },
};