var baseConfig = require('./base.conf');

module.exports = function(config) {
  baseConfig(config);
  config.set({
    'browsers': ['Chrome']
  });
};
