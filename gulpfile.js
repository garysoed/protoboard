var gulp = require('gulp');

var jshint = require('gulp-jshint');
var shell = require('gulp-shell');
var sass = require('gulp-ruby-sass');

var yuimd = require('yuimd');

gulp.task('jshint', function() {
  return gulp.src('./src/**/*.js')
      .pipe(jshint({
        esnext: true
      }))
      .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('traceur', ['jshint'], function() {
  return gulp.src('./src/modules.js')
      .pipe(shell([
        'traceur --out <%= out %> <%= file.path %> --source-maps=file --symbols=true --modules=inline'
      ],
      {
        templateData: {
          out: 'main.js'
        }
      }));
});

gulp.task('test', ['traceur'], function() {
  return gulp.src('karma.conf.js')
    .pipe(shell(['karma start <%= file.path %> --single-run']))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('doc', function() {
  return gulp.src('gulpfile.js')
      .pipe(yuimd({
        'projectName': 'Protoboard',
        '$home': 'doc-theme/Home.theme',
        '$class': 'doc-theme/class.theme',
        'src': './src/'
      }))
      .pipe(gulp.dest('doc'));
});

gulp.task('sass', function() {
  return gulp.src('./src/**/*.scss')
      .pipe(sass({loadPath: ['src/themes']}))
      .pipe(gulp.dest('out'));
});

gulp.task('push', ['test', 'doc', 'sass'], shell.task('git push'));

gulp.task('watch', function() {
  gulp.watch(['src/**/*.js', 'test/**/*.html'], ['test', 'sass']);
});

gulp.task('watch-traceur', function() {
  gulp.watch(['src/**/*.js'], ['traceur']);
})
