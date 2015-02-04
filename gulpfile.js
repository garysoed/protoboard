var gulp    = require('gulp');
var debug   = require('gulp-debug');
var plumber = require('gulp-plumber');
var through = require('through2');
var subtask = require('gulp-subtask')(gulp);

var chalk  = require('chalk');
var jshint = require('gulp-jshint');
var karma  = require('karma').server;
var shell  = require('gulp-shell');
var sass   = require('gulp-ruby-sass');
var yuidoc = require('gulp-yuidoc');
var yuimd  = require('yuimd');
var to5    = require('gulp-6to5');
var subs   = require('gulp-html-subs');

var gutil   = require('gulp-util');

function chain(fn) {
  return through.obj(function(file, enc, callback) {
    var stream = gulp.src('')
        .pipe(plumber({
          errorHandler: function(err) {
            this.emit('error', err);
          }.bind(this)
        }))
        .pipe(through.obj(function(f, enc, cb) {
          cb(null, file);
        }));
    fn(stream)
        .pipe(through.obj(function(f, enc, cb) {
          this.push(f);
          cb(null, f);
        }.bind(this), function(cb) {
          callback();
          cb();
        }));
  });
}


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
  return gulp.src('./src/**/*.html')
      .pipe(yuidoc.parser({
        extension: '.html'
      }))
      .pipe(yuimd({
        'projectName': 'Protoboard',
        '$home': 'doc-theme/Home.theme',
        '$class': 'doc-theme/class.theme'
      }))
      .pipe(gulp.dest('doc'));
});

function sub6to5() {
  return chain(function(stream) {
    var replace = subs();
    return stream
        .pipe(replace.extract)
            .pipe(to5({modules: 'ignore'}))
        .pipe(replace.inject);
  });

  // return new subtask('6to5')
  //     .pipe(function() { return replace.extract; })
  //         .pipe(to5, {modules: 'ignore'})
  //     .pipe(function() { return replace.inject; })
  //     .pipe(debug, {title: chalk.green('6to5')});
}

function subSass() {
  return chain(function(stream) {
    return stream
        .pipe(sass({loadPath: ['src/themes']}));
  });
}

gulp.task('6to5-src', function() {
  return gulp.src(['./src/**/*.html'])
      .pipe(sub6to5())
      .pipe(gulp.dest('out'));
});

gulp.task('6to5-test', function() {
  return gulp.src(['./test/**/*_test.html', './test/testbase.html'])
      .pipe(sub6to5())
      .pipe(gulp.dest('out'));
});

gulp.task('karma', ['6to5-src', '6to5-test'], function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('karma-dev', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done);
});

gulp.task('sass-src', function() {
  return gulp.src(['./src/**/*.scss', '!./src/themes/*.scss'])
      .pipe(subSass())
      .pipe(gulp.dest('out'));
});

gulp.task('watch', function() {
  // SASS
  gulp.watch(['src/**/*.scss'], function(event) {
    var base = event.path.substring(__dirname.length).split('/')[1];
    gulp.src(event.path, {base: base})
        .pipe(plumber())
        .pipe(subSass())
        .pipe(debug({title: chalk.green('sass')}))
        .pipe(gulp.dest('out'));
  });

  // SASS for examples
  gulp.watch(['ex/**/*.scss', 'src/themes/*.scss'], function(event) {
    var base = event.path.substring(__dirname.length).split('/')[1];
    gulp.src(event.path, {base: base})
        .pipe(plumber())
        .pipe(subSass())
        .pipe(debug({title: chalk.green('sass')}))
        .pipe(gulp.dest('ex'));
  });

  // 6to5
  gulp.watch(['src/**/*.html', 'test/**/*.html'], function(event) {
    var base = event.path.substring(__dirname.length).split('/')[1];
    gulp.src(event.path, {base: base})
        .pipe(plumber())
        .pipe(sub6to5())
        .pipe(debug({title: chalk.green('6to5')}))
        .pipe(gulp.dest('out'));
  });
});

gulp.task('push', ['karma', 'doc'], shell.task('git push'));
