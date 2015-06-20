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
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var zip    = require('gulp-zip');

var chalk    = require('chalk');
var karma    = require('karma').server;
var minimist = require('minimist');

var loadtheme = require('./loadtheme');

var VERSION = '0.3.1';

function runKarma(singleRun, callback) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
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

// Tasks
gulp.task('copy-deps', gulp.parallel(
    function _copyBower() {
      return gulp
          .src([
              'bower_components/animate.css/animate.min.css',
              'bower_components/chance/chance.js',
              'bower_components/di-js/out/bin.min.js',
              'bower_components/hammerjs/hammer.js',
              'bower_components/handlebars/handlebars.js',
              'bower_components/jquery/dist/jquery.js',
              'bower_components/Keypress/keypress.js',
              'bower_components/listener/out/bin.min.js',
            ],
            { base: 'bower_components' })
          .pipe(gulp.dest('out/third_party'));
    },
    function _copyBabelPolyfill() {
      return gulp
          .src([
              'node_modules/gulp-babel/node_modules/babel-core/browser-polyfill.js',
            ],
            { base: 'node_modules/gulp-babel/node_modules' })
          .pipe(gulp.dest('out/third_party'));
    }
));

gulp.task('js-hint', function() {
  return gulp.src(['./src/**/*.html', './test/**/*.html'])
      .pipe(newer('out'))
      .pipe(jshint.extract())
      .pipe(jshint({
        esnext: true,
        laxbreak: true,
        sub: true
      }))
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('source', gulp.series(
    gulp.parallel('js-hint', 'copy-deps'),
    function _source() {
      var styleSubs = subs('style');
      var scriptSubs = subs('script');

      return gulp.src(['./src/**/*.html'])
          .pipe(newer('out'))
          .pipe(scriptSubs.extract)
              .pipe(babel({modules: 'ignore', comments: false}))
          .pipe(scriptSubs.inject)
          .pipe(styleSubs.extract)
              .pipe(compileTheme())
          .pipe(styleSubs.inject)
          .pipe(gulp.dest('out'));
    }
));

gulp.task('test-source', gulp.series(
    'js-hint',
    function _testSource() {
      var scriptSubs = subs('script');

      return gulp.src(['./test/**/*_test.html', './test/testbase.html'])
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
  return gulp.src('')
      .pipe(shell('rm -r out doc'));
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

gulp.task('watch', gulp.parallel(
    gulp.series(
        'source',
        function _watchSources() {
          gulp.watch('src/**/*.html', gulp.task('source'));
        }),
    gulp.series(
        'test-source',
        function _watchTestSources() {
          gulp.watch('test/**/*.html', gulp.task('test-source'));
        })
    ));

gulp.task('pack', gulp.series(
    'clean',
    gulp.parallel('compile', 'doc'),
    function _bump() {
      return gulp.src(['./bower.json', './package.json', './yuidoc.json'])
          .pipe(bump({version: VERSION}))
          .pipe(gulp.dest('./'));
    },
    function _minimize() {
      var scriptSubs = subs('script');
      return gulp.src(['./out/**/*.html'])
          .pipe(ignore.exclude(/.*_test\.html$/))
          .pipe(scriptSubs.extract)
              .pipe(uglify())
          .pipe(scriptSubs.inject)
          .pipe(rename(function(path) {
            path.basename += '.min';
          }))
          .pipe(gulp.dest('out'));
    },
    gulp.parallel(
        function _packMin() {
          return gulp.src(['./out/**/*.min.html', './out/**/*.js', './out/**/*.css'])
              .pipe(zip('bin.min.zip'))
              .pipe(gulp.dest('dist'));
        },
        function _pack() {
          return gulp.src('out/**/*')
              .pipe(ignore.exclude(/.*_test\.html$/))
              .pipe(ignore.exclude(/.*\.min\.html$/))
              .pipe(zip('bin.zip'))
              .pipe(gulp.dest('dist'));
        })
))
