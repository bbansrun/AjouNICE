module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
  ],
  rules: {
    'comma-dangle': ['error', {
      'objects': 'always',
    }],
    'semi': ['error', 'always'],
    'no-return-await': 'off',
    'camelcase': 'off',
  },
}
