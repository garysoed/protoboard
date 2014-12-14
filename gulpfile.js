var gulp   = require('gulp');

var jshint = require('gulp-jshint');
var shell  = require('gulp-shell');
var sass   = require('gulp-ruby-sass');
var yuimd  = require('yuimd');


var handleError = function(error) {
  console.log(error.toString());
  this.emit('end');
};

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
      .pipe(shell(['karma start <%= file.path %> --single-run --color']))
      .on('error', handleError);
});

gulp.task('test-dev', ['traceur'], function() {
  return gulp.src('karma.conf.js')
      .pipe(shell(['karma start <%= file.path %> --color']))
      .on('error', handleError);
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
      .on('error', handleError)
      .pipe(gulp.dest('out'));
});

gulp.task('push', ['test', 'doc', 'sass'], shell.task('git push'));

gulp.task('watch', function() {
  gulp.watch(['src/**/*.js'], ['traceur']);
  gulp.watch(['src/**/*.scss'], ['sass']);
});

gulp.task('watch-traceur', function() {
  gulp.watch(['src/**/*.js'], ['traceur']);
});
