module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: ['airbnb-base', 'airbnb-typescript/base'],
  parserOptions: {
    sourceType: 'module',
    project: 'tsconfig.eslint.json',
  },
};
