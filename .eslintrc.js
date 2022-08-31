module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    sourceType: 'module',
    project: 'tsconfig.eslint.json',
  },
};
