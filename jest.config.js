module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  testURL: 'http://localhost',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|gql)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: ['<rootDir>/(tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx))'],
  collectCoverage: process.env.CIRCLECI === 'true',
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!**/node_modules/**',
    // Ignore Symlink files
    '!src/store/modules/schedulerPool.js',
    '!src/store/modules/groupsPool.js'
  ]
}
