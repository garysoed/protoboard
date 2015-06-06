var baseConfig = require('./base.conf');

module.exports = function(config) {
  baseConfig(config);
  config.set({
    'browsers': ['Firefox']
  });

  config.files
      .push({ pattern: 'bower_components/webcomponentsjs/webcomponents.min.js', included: true });
};
