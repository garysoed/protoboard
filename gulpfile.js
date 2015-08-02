var gulp    = require('gulp');
var debug   = require('gulp-debug');
var plumber = require('gulp-plumber');

var babel  = require('gulp-babel');
var bump   = require('gulp-bump');
var ignore = require('gulp-ignore');
var jshint = require('gulp-jshint');
var myth   = require('gulp-myth');
var newer  = require('gulp-newer');
var shell  = require('gulp-shell');
var subs   = require('gulp-html-subs');
var uglify = require('gulp-uglify');
var zip    = require('gulp-zip');

var chalk    = require('chalk');
var karma    = require('karma').server;
var minimist = require('minimist');

var path = require('path');
var glob = require('glob');

var Promise = require('promise');

var loadtheme = require('./loadtheme');

var VERSION = '2.0.2';

var PARALLEL_TEST_COUNT = 2;

var SRC_DIR  = 'src';
var TEST_DIR = 'test';
var DOC_DIR  = 'doc';
var OUT_DIR  = 'out';
var MIN_DIR  = 'min';

var KARMA_CONF = __dirname + '/karma.conf.js';
var KARMA_CONFIG = require(KARMA_CONF);

function runKarma(singleRun, callback) {
  karma.start({
    configFile: KARMA_CONF,
    singleRun: singleRun
  }, callback);
};

function compileTheme() {
  var options = minimist(process.argv.slice(2), {
    'string': 'theme',
    'default': {
      'theme': './themes/slateblue.json'
    }
  });
  return myth({ 'variables': loadtheme(options.theme) });
}

function copyDeps(outDir) {
  return gulp.parallel(
      function _copyBower() {
        return gulp
            .src([
                'bower_components/animate.css/animate.min.css',
                'bower_components/chance/chance.js',
                'bower_components/di-js/out/bin.min.js',
                'bower_components/di-js/out/bin.js',
                'bower_components/hammerjs/hammer.js',
                'bower_components/handlebars/handlebars.js',
                'bower_components/jquery/dist/jquery.js',
                'bower_components/Keypress/keypress.js',
                'bower_components/listener/out/bin.min.js',
              ],
              { base: 'bower_components' })
            .pipe(gulp.dest(path.join(outDir, 'third_party')));
      },
      function _copyBabelPolyfill() {
        return gulp
            .src([
                'node_modules/gulp-babel/node_modules/babel-core/browser-polyfill.js',
              ],
              { base: 'node_modules/gulp-babel/node_modules' })
            .pipe(gulp.dest(path.join(outDir, 'third_party')));
      }
  )
}

// Tasks
gulp.task('copy-deps', copyDeps(OUT_DIR));
gulp.task('copy-deps-min', copyDeps(MIN_DIR));

gulp.task('js-hint', function() {
  return gulp.src([SRC_DIR + '/**/*.html', TEST_DIR + '/**/*.html'])
      .pipe(newer(OUT_DIR))
      .pipe(jshint.extract())
      .pipe(jshint({
        esnext: true,
        laxbreak: true,
        sub: true,
        expr: true,
      }))
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('source', gulp.series(
    gulp.parallel('js-hint', 'copy-deps'),
    function _source() {
      var styleSubs = subs('style');
      var scriptSubs = subs('script');

      return gulp.src([SRC_DIR + '/**/*.html'])
          .pipe(newer(OUT_DIR))
          .pipe(scriptSubs.extract)
              .pipe(babel({modules: 'ignore', comments: false}))
          .pipe(scriptSubs.inject)
          .pipe(styleSubs.extract)
              .pipe(compileTheme())
          .pipe(styleSubs.inject)
          .pipe(gulp.dest(OUT_DIR));
    }
));

gulp.task('test-source', gulp.series(
    'js-hint',
    function _testSource() {
      var scriptSubs = subs('script');

      return gulp.src([TEST_DIR + '/**/*_test.html', TEST_DIR +'/testbase.html'])
          .pipe(newer('out'))
          .pipe(scriptSubs.extract)
              .pipe(babel({modules: 'ignore', comments: false}))
          .pipe(scriptSubs.inject)
          .pipe(gulp.dest('out'));
    }
));

gulp.task('doc', gulp.series(
    function _genDoc() {
      return gulp.src('')
          .pipe(shell('yuidoc --config yuidoc.json'));
    },
    function _packDoc() {
      return gulp.src(['doc/**'])
          .pipe(gulp.dest('../protoboard-doc'));
    }
));
gulp.task('clean', function() {
  return gulp.src([OUT_DIR, DOC_DIR, MIN_DIR])
      .pipe(shell('rm -rf ' + OUT_DIR + ' ' + DOC_DIR + ' ' + MIN_DIR))
      .pipe(shell('rm -rf ../protoboard-doc/classes'));
});

gulp.task('compile', gulp.parallel('source', 'test-source', 'copy-deps'));
gulp.task('test', gulp.series(
    'compile',
    function _test(done) {
      runKarma(true /* singleRun */, done);
    }
));
gulp.task('test-server', function(done) {
  runKarma(false /* singleRun */, done);
});

function karmaRunner(files, callback, opt_errors) {
  if (files.length <= 0) {
    callback(opt_errors || []);
    return;
  }

  var file = files.pop();
  console.log('Testing: ' + file);
  karma.start({
    configFile: KARMA_CONF,
    singleRun: true,
    files: [
      // Generated files
      { pattern: 'out/**/!(*_test).*', included: false },

      // Deps
      { pattern: 'node_modules/chai/chai.js', included: false },
      { pattern: 'node_modules/spies/**', included: false },

      { pattern: 'out/testbase.html', included: false},
      { pattern: file, included: true }
    ]
  },
  function(err) {
    var errors = opt_errors || [];
    if (err) {
      errors.push(err);
    }

    karmaRunner(files, callback, errors);
  });
}
gulp.task('test-slow', gulp.series(
    'compile',
    function _testSlow(done) {
      var options = minimist(process.argv.slice(2), {
        'string': 'glob',
        'default': {
          'glob': 'out/**/*_test.html'
        }
      });

      var files = glob.sync(options.glob);
      console.log('Found ' + files.length + ' tests');

      var fileGroups = [];
      for (var i = 0; i < PARALLEL_TEST_COUNT; i++) {
        fileGroups.push([]);
      }

      var groupIdx = 0;
      while (files.length > 0) {
        fileGroups[groupIdx].push(files.pop());
        groupIdx = (groupIdx + 1) % fileGroups.length;
      }

      console.log('Running ' + fileGroups.length + ' tests in parallel');
      var promises = fileGroups.map(function(fileGroup) {
        return new Promise(function(resolve, reject) {
          karmaRunner(fileGroup, resolve);
        });
      });

      Promise.all(promises).then(function(errorsArray) {
        var errors = errorsArray.reduce(Array.prototype.concat);
        if (errors.length > 0) {
          callback(new Error(errors.join('\n')));
        } else {
          callback();
        }
      });
    }
));

gulp.task('watch', gulp.parallel(
    gulp.series(
        'source',
        function _watchSources() {
          gulp.watch([SRC_DIR + '/**/*.html', SRC_DIR + '/*.html'], gulp.task('source'));
        }),
    gulp.series(
        'test-source',
        function _watchTestSources() {
          gulp.watch([TEST_DIR + '/**/*.html', TEST_DIR + '/*.html'], gulp.task('test-source'));
        })
    ));

gulp.task('pack', gulp.series(
    'clean',
    gulp.parallel('compile', 'doc'),
    gulp.parallel(
        function _bump() {
          return gulp.src(['./bower.json', './package.json', './yuidoc.json'])
              .pipe(bump({version: VERSION}))
              .pipe(gulp.dest('./'));
        },
        function _minimize() {
          var scriptSubs = subs('script');
          return gulp.src([OUT_DIR + '/**/*.html'])
              .pipe(ignore.exclude(/.*_test\.html$/))
              .pipe(scriptSubs.extract)
                  .pipe(uglify())
              .pipe(scriptSubs.inject)
              .pipe(gulp.dest(MIN_DIR));
        },
        'copy-deps-min'
    ),
    gulp.parallel(
        function _packMin() {
          return gulp.src([MIN_DIR + '/**/*'])
              .pipe(zip('bin.min.zip'))
              .pipe(gulp.dest('dist'));
        },
        function _pack() {
          return gulp.src(OUT_DIR + '/**/*')
              .pipe(ignore.exclude(/.*_test\.html$/))
              .pipe(ignore.exclude(/.*\.min\.html$/))
              .pipe(zip('bin.zip'))
              .pipe(gulp.dest('dist'));
        })
    ));

gulp.task('default', gulp.task('test'));
