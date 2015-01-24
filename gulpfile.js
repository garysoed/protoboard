var gulp   = require('gulp');

var jshint = require('gulp-jshint');
var shell  = require('gulp-shell');
var sass   = require('gulp-ruby-sass');
var yuimd  = require('yuimd');
var to5    = require('gulp-6to5');

var through = require('through2');
var jsdom   = require('jsdom');
var gutil   = require('gulp-util');
var path    = require('path');


function replaceScript() {
  var targetFiles = {};
  return {
    from: through.obj(function(file, enc, cb) {
      if (file.isBuffer()) {
        var html = String(file.contents);
        var targetFile = new gutil.File({
          cwd: file.cwd,
          path: file.path,
          base: file.base,
          stat: file.stat,
          contents: file.contents
        });
        targetFile.$components = {};
        targetFiles[file.path] = targetFile;

        jsdom.env(
            html,
            [],
            function(errors, window) {
              if (errors) {
                cb(errors);
              }

              var elements = window.document.querySelectorAll('script');
              for (var i = 0; i < elements.length; i++) {
                targetFile.$components[i] = null;
                this.push(new gutil.File({
                  cwd: file.cwd,
                  path: file.path + '.' + i,
                  base: file.base,
                  stat: file.stat,
                  contents: new Buffer(elements[i].innerHTML)
                }));
              };

              if (elements.length <= 0) {
                // Send out a fake file so the pipe can still go.
                this.push(new gutil.File({
                  cwd: file.cwd,
                  path: file.path + '.0',
                  base: file.base,
                  stat: file.stat,
                  contents: new Buffer('')
                }));
              }
              cb();
            }.bind(this));
      }
    }),

    to: through.obj(function(file, enc, cb) {
      if (file.isBuffer()) {
        var ext = path.extname(file.path);
        var filepath = file.path.substring(0, file.path.length - ext.length);
        var id = ext.substring(1);
        var targetFile = targetFiles[filepath];
        targetFile.$components[id] = file.contents;

        // Check if all the components are ready.
        var isReady = true;
        for (var i in targetFile.$components) {
          isReady = isReady && targetFile.$components[i] !== null;
        };

        if (isReady) {
          jsdom.env(
              String(targetFile.contents),
              [],
              function(errors, window) {
                if (errors) {
                  cb(errors);
                }
                
                var elements = window.document.querySelectorAll('script');
                for (var i = 0; i < elements.length; i++) {
                  elements[i].innerHTML = targetFile.$components[i];
                }

                targetFile.contents = new Buffer(window.document.querySelector(':root').outerHTML);
                this.push(targetFile);
                cb();
              }.bind(this));
        } else {
          cb();
        }
      }
    })
  }
}

gulp.task('6to5', function() {
  var replace = replaceScript();
  return gulp.src('./src/**/*.html', {base: './src'})
      .pipe(replace.from)
      .pipe(to5({modules: 'ignore'}))
      .pipe(replace.to)
      .pipe(gulp.dest('out'));
});

var handleError = function(error) {
  console.log(error.toString());
  this.emit('end');
};

gulp.task('jshint', function() {
  return gulp.src('./src/**/*.js')
      .pipe(jshint({
        esnext: true,
        sub: true
      }))
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'))
      .on('error', handleError);
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

gulp.task('sass-ex', function() {
  return gulp.src('./ex/**/*.scss')
      .pipe(sass({ loadPath: ['src/themes'] }))
      .on('error', handleError)
      .pipe(gulp.dest('ex'));
});

gulp.task('sass-src', function() {
  return gulp.src(['./src/**/*.scss', '!./src/themes/*.scss'])
      .pipe(sass({loadPath: ['src/themes']}))
      .on('error', handleError)
      .pipe(gulp.dest('out'));
});

gulp.task('sass', ['sass-src', 'sass-ex']);
gulp.task('push', ['test', 'doc', 'sass'], shell.task('git push'));

gulp.task('watch', function() {
  gulp.watch(['src/**/*.js'], ['traceur']);
  gulp.watch(['src/**/*.scss'], ['sass-src']);
  gulp.watch(['src/**/*.html'], ['6to5']);
  gulp.watch(['ex/**/*.scss', 'src/themes/*.scss'], ['sass-ex']);
});

gulp.task('watch-traceur', function() {
  gulp.watch(['src/**/*.js'], ['traceur']);
});
