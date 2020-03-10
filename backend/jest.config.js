module.exports = {
    testTimeout: 10000,
    bail: true,
    collectCoverage: true,
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/app/repository',
        '/tests/'
    ],
    transform: { '^.+\\.ts?$': 'ts-jest' },
    testEnvironment: 'node',
    testRegex: '/tests/.*\\.(test|spec)?\\.(ts|js)$',
    moduleFileExtensions: ['ts', 'js', 'json', 'node']
};