// Karma configuration
// Generated on Wed Oct 22 2014 17:44:56 GMT-0700 (PDT)

var base = require('./karma_base.conf.js');

module.exports = function(config) {
  var configObj = JSON.parse(JSON.stringify(base));
  configObj.basePath = '.';
  configObj.files.push({ pattern: 'out/**/*_test.html', included: true });
  configObj.files.push({ pattern: 'out/**/*_testsuite.html', included: false });
  config.set(configObj);
};
