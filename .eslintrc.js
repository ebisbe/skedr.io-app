module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/recommended', '@vue/prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': ['error', 'never'],
    'linebreak-style': 'off',
    'vue/no-v-html': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
