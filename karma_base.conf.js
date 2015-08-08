// Karma configuration
// Generated on Wed Oct 22 2014 17:44:56 GMT-0700 (PDT)

module.exports = {

  // base path that will be used to resolve all patterns (eg. files, exclude)
  basePath: '',


  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ['mocha'],


  // list of files / patterns to load in the browser
  files: [
    // Generated files
    { pattern: 'out/**/!(*_test).*', included: false },

    // Deps
    { pattern: 'node_modules/chai/chai.js', included: false },
    { pattern: 'node_modules/spies/main.html', included: false },
    { pattern: 'node_modules/spies/main.js', included: false },
    { pattern: 'node_modules/spies/main_chai_expect.html', included: false },
    { pattern: 'node_modules/spies/node_modules/chai/chai.js', included: false },
    { pattern: 'node_modules/spies/node_modules/traceur/bin/traceur-runtime.js', included: false },
    { pattern: 'node_modules/spies/src/plugin/chai-expect.js', included: false },

    { pattern: 'out/testbase.html', included: false },
  ],


  // list of files to exclude
  exclude: [

  ],


  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  preprocessors: {
  },


  // test results reporter to use
  // possible values: 'dots', 'progress'
  // available reporters: https://npmjs.org/browse/keyword/karma-reporter
  reporters: ['mocha'],

  mochaReporter: {
    output: 'autowatch'
  },


  // web server port
  port: 9876,


  // enable / disable colors in the output (reporters and logs)
  colors: true,


  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: true,


  // start these browsers
  // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
  browsers: ['Chrome'],


  // Continuous Integration mode
  // if true, Karma captures browsers, runs the tests and exits
  singleRun: false
};
