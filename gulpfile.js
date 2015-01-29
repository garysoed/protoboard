var gulp    = require('gulp');
var watch   = require('gulp-watch');
var plumber = require('gulp-plumber');
var batch   = require('gulp-batch');

var jshint = require('gulp-jshint');
var shell  = require('gulp-shell');
var sass   = require('gulp-ruby-sass');
var yuimd  = require('yuimd');
var to5    = require('gulp-6to5');
var subs   = require('gulp-html-subs');

var gutil   = require('gulp-util');
var path    = require('path');


// TODO(gs): Fix this.
gulp.task('jshint', function() {
  return gulp.src('./src/**/*.html')
      .pipe(jshint({
        esnext: true,
        sub: true
      }))
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('test', ['6to5'], function() {
  return gulp.src('karma.conf.js')
      .pipe(shell(['karma start <%= file.path %> --single-run --color']));
});

gulp.task('test-dev', ['6to5'], function() {
  return gulp.src('karma.conf.js')
      .pipe(shell(['karma start <%= file.path %> --color']));
});

function run6to5() {
  return to5({modules: 'ignore'});
}

gulp.task('6to5', function() {
  var replace = subs();
  return gulp.src(['./src/**/*.html', './test/**/*_test.html', './test/testbase.html'])
      .pipe(replace.extract)
        .pipe(run6to5())
      .pipe(replace.inject)
      .pipe(gulp.dest('out'));
});


gulp.task('doc', function() {
  return gulp.src('gulpfile.js')
      .pipe(yuimd({
        'projectName': 'Protoboard',
        '$home': 'doc-theme/Home.theme',
        '$class': 'doc-theme/class.theme',
        'src': ['./src'],
        'extension': '.html'
      }))
      .pipe(gulp.dest('doc'));
});


function runSass() {
  return sass({loadPath: ['src/themes']});
}

gulp.task('sass', function() {
  return gulp.src(['./src/**/*.scss', '!./src/themes/*.scss'])
      .pipe(runSass())
      .pipe(gulp.dest('out'));
});

gulp.task('sass-ex', function() {
  return gulp.src('./ex/**/*.scss')
      .pipe(runSass())
      .pipe(gulp.dest('ex'));
});

gulp.task('watch', function() {
  // SASS
  watch(['src/**/*.scss'], batch(function(events) {
    gutil.log('Running sass');
    return events
        .pipe(plumber())
        .pipe(runSass())
        .pipe(gulp.dest('out'));
  }));

  watch(['ex/**/*.scss', 'src/themes/*.scss'], batch(function(events) {
    gutil.log('Running sass-ex');
    return events
        .pipe(plumber())
        .pipe(runSass())
        .pipe(gulp.dest('ex'));
  }));

  var replace = subs();
  watch(['src/**/*.html', 'test/**/*.html'], batch(function(events) {
    gutil.log('Running 6to5');
    return events
        .pipe(plumber())
        .pipe(replace.extract)
          .pipe(run6to5())
        .pipe(replace.inject)
        .pipe(gulp.dest('out'));
  }));
});

gulp.task('push', ['test', 'doc', 'sass'], shell.task('git push'));
