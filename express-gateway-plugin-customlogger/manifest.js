module.exports = {
  version: '1.2.0',
  init: function (pluginContext) {
    let policy = require('./policies/customlogger')
    pluginContext.registerPolicy(policy)
  }
}
