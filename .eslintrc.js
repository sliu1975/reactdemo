module.exports = {
  root: true,

  parser: 'babel-eslint',

  extends: ['@dragon/eslint-config/react'],

  rules: {
    // off"或0 -关闭规则 "warn" 或1 - 开启规则 "error"或2 - 开启规则
    'jsx-a11y/anchor-is-valid': 0
  },
  settings: {
    polyfills: ['fetch', 'promises', 'url'],
    'import/resolver': { node: { extensions: ['.js', '.ts', '.tsx'] } }
  }
}
