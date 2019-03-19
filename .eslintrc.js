module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs'
  ],
  // add your custom rules here
  rules: {
    'no-console': "off",
    "comma-dangle": ["error", "only-multiline"],
    "space-before-function-paren": ["error", "always"],
    'arrow-parens': ["error", "as-needed"],
  }
}
