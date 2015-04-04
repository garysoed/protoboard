var gulp    = require('gulp');
var debug   = require('gulp-debug');
var plumber = require('gulp-plumber');

var jshint = require('gulp-jshint');
var shell  = require('gulp-shell');
var subs   = require('gulp-html-subs');
var babel  = require('gulp-babel');
var zip    = require('gulp-zip');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var chalk    = require('chalk');
var karma    = require('karma').server;
var minimist = require('minimist');
var through  = require('through2');
var yuidoc   = require('yuidocjs');

var browserify = require('browserify');
var babelify = require('babelify');

var options = minimist(process.argv.slice(2), {
  'string': 'theme',
  'default': {
    'theme': './themes/slateblue.json'
  }
});

function chain(fn) {
  return through.obj(function(file, enc, callback) {
    // TODO(gs): How to open a stream?
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

function subJsHint() {
  return chain(function(stream) {
    return stream
        .pipe(jshint.extract())
        .pipe(jshint({
          esnext: true,
          laxbreak: true,
          sub: true
        }))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
  })
}

function subBrowserifyBabel() {
  return through.obj(function (file, enc, next) {
    browserify(file.path, { debug: true })
        .transform(babelify)
        .bundle(function (err, res) {
          if (err) {
            return next(err);
          }

          file.contents = res;
          next(null, file);
        });
  });
}

function readJsonTheme(file) {
  var json = require(file);
  var base = json.base ? readJsonTheme(json.base) : {};
  for (var key in json.vars) {
    base[key] = json.vars[key];
  }
  return base;
}

gulp.task('clean', shell.task('rm -r out doc'));

gulp.task('doc-gen', shell.task('yuidoc --config yuidoc.json'));

gulp.task('doc', ['demo', 'doc-gen'], function() {
  return gulp.src(['doc/**'])
      .pipe(gulp.dest('../di-doc'));
});

gulp.task('jshint', function() {
  return gulp.src(['./src/**/*.js', './test/**/*.html'])
      .pipe(plumber())
      .pipe(subJsHint());
});

gulp.task('src', ['jshint'], function() {
  return gulp.src('./src/index.js')
      .pipe(subBrowserifyBabel())
      .pipe(rename('bin.js'))
      .pipe(gulp.dest('out'));
});

gulp.task('test', ['jshint', 'src'], function() {
  var scriptSubs = subs('script[lang="es6"]');
  return gulp.src(['./test/**/*_test.html', './test/testutils.html'])
      .pipe(scriptSubs.extract)
          .pipe(babel())
      .pipe(scriptSubs.inject)
      .pipe(gulp.dest('out'));
});

gulp.task('karma', ['src', 'test'], function(done) {
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

gulp.task('watch', function() {
  // src
  gulp.watch(['src/**/*.html', 'test/**/*.html'], function(event) {
    var base = event.path.substring(__dirname.length).split('/')[1];
    gulp.src(event.path, {base: base})
        .pipe(plumber())
        .pipe(subBabel())
        .pipe(debug({title: chalk.green('src')}))
        .pipe(gulp.dest('out'));
  });

  // JSHint
  gulp.watch(['src/**/*.html', 'test/**/*.html'], function(event) {
    var base = event.path.substring(__dirname.length).split('/')[1];
    gulp.src(event.path, {base: base})
        .pipe(plumber())
        .pipe(subJsHint())
        .pipe(debug({title: chalk.green('jshint')}));
  });
});

gulp.task('compile', ['src', 'test']);
gulp.task('pack', ['src'], function() {
  return gulp.src('out/bin.js')
      .pipe(uglify())
      .pipe(rename('bin.min.js'))
      .pipe(gulp.dest('out'));
});
gulp.task('check', ['karma']);
