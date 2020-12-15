module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    },
    electronBuilder: {
      nodeIntegration: true
    }
  },
  transpileDependencies: [
    'quasar'
  ]
}
