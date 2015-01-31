var gulp    = require('gulp');
var plumber = require('gulp-plumber');

var jshint = require('gulp-jshint');
var shell  = require('gulp-shell');
var sass   = require('gulp-ruby-sass');
var yuimd  = require('yuimd');
var to5    = require('gulp-6to5');
var subs   = require('gulp-html-subs');

var gutil   = require('gulp-util');


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

gulp.task('test', ['6to5'], function() {
  return gulp.src('karma.conf.js')
      .pipe(shell(['karma start <%= file.path %> --single-run --color']));
});

gulp.task('test-dev', ['6to5'], function() {
  return gulp.src('karma.conf.js')
      .pipe(shell(['karma start <%= file.path %> --color']));
});

function run6to5(vinyl) {
  gutil.log('Running', gutil.colors.cyan('6to5'));
  var replace = subs();
  return vinyl
      .pipe(replace.extract)
        .pipe(to5({modules: 'ignore'}))
      .pipe(replace.inject)
      .on('end', function() { gutil.log('Done'); });
}

gulp.task('6to5', function() {
  return run6to5(
      gulp.src(['./src/**/*.html', './test/**/*_test.html', './test/testbase.html']))
      .pipe(gulp.dest('out'));
});


function runSass(vinyl) {
  gutil.log('Running', gutil.colors.cyan('sass'));
  return vinyl
      .pipe(sass({loadPath: ['src/themes']}))
      .on('end', function() { gutil.log('Done'); });
}

gulp.task('sass', function() {
  return runSass(gulp.src(['./src/**/*.scss', '!./src/themes/*.scss']))
      .pipe(gulp.dest('out'));
});

gulp.task('sass-ex', function() {
  return runSass(gulp.src('./ex/**/*.scss'))
      .pipe(gulp.dest('ex'));
});

gulp.task('watch', function() {
  // SASS
  gulp.watch(['src/**/*.scss'], function(event) {
    gutil.log(gutil.colors.magenta(event.path), event.type);
    runSass(gulp.src(event.path).pipe(plumber()))
        .pipe(gulp.dest('out'));
  });

  gulp.watch(['ex/**/*.scss', 'src/themes/*.scss'], function(event) {
    gutil.log(gutil.colors.magenta(event.path), event.type);
    runSass(gulp.src(event.path).pipe(plumber()))
        .pipe(gulp.dest('ex'));
  });

  gulp.watch(['src/**/*.html', 'test/**/*.html'], function(event) {
    var base = event.path.substring(__dirname.length).split('/')[1];
    gutil.log(gutil.colors.magenta(event.path), event.type, gutil.colors.magenta(base));
    run6to5(
        gulp.src(event.path, {base: base})
            .pipe(plumber()))
        .pipe(gulp.dest('out'));
  });
});

gulp.task('push', ['test', 'doc', 'sass'], shell.task('git push'));
