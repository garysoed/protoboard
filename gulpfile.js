var gulp    = require('gulp');
var watch   = require('gulp-watch');
var plumber = require('gulp-plumber');
var batch   = require('gulp-batch');

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
  var replace = replaceScript();
  return gulp.src('./src/**/*.html', {base: './src'})
      .pipe(replace.from)
        .pipe(run6to5())
      .pipe(replace.to)
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
    return events
        .pipe(plumber())
        .pipe(runSass())
        .pipe(gulp.dest('out'));
  }));

  watch(['ex/**/*.scss', 'src/themes/*.scss'], batch(function(events) {
    return events
        .pipe(plumber())
        .pipe(runSass())
        .pipe(gulp.dest('ex'));
  }));

  watch(['src/**/*.html'], batch(function(events) {
    var replace = replaceScript();
    return events
        .pipe(plumber())
        .pipe(replace.from)
          .pipe(run6to5())
        .pipe(replace.to)
        .pipe(gulp.dest('out'));
  }));
});

gulp.task('push', ['test', 'doc', 'sass'], shell.task('git push'));
