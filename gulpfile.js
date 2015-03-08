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
var myth   = require('gulp-myth');
var zip    = require('gulp-zip');

var gutil    = require('gulp-util');
var minimist = require('minimist');

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

function sub6to5() {
  return chain(function(stream) {
    var scriptSubs = subs('script');
    return stream
        .pipe(scriptSubs.extract)
            .pipe(to5({modules: 'ignore'}))
        .pipe(scriptSubs.inject);
  });

  // return new subtask('6to5')
  //     .pipe(function() { return replace.extract; })
  //         .pipe(to5, {modules: 'ignore'})
  //     .pipe(function() { return replace.inject; })
  //     .pipe(debug, {title: chalk.green('6to5')});
}

function readJsonTheme(file) {
  var json = require(file);
  var base = json.base ? readJsonTheme(json.base) : {};
  for (var key in json.vars) {
    base[key] = json.vars[key];
  }
  return base;
}

function subMyth() {
  return chain(function(stream) {
    return stream
        .pipe(myth({ 'variables': readJsonTheme(options.theme) }));
  })
}

function subMythHtml() {
  return chain(function(stream) {
    var styleSubs = subs('style');
    return stream
        .pipe(styleSubs.extract)
            .pipe(subMyth())
        .pipe(styleSubs.inject);
  });
}

function subSass() {
  return chain(function(stream) {
    return stream
        .pipe(sass({loadPath: ['src/themes']}));
  });
}

function subYuiMd() {
  return chain(function(stream) {
      return stream.pipe(yuidoc.parser({
        extension: '.html'
      }))
      .pipe(yuimd({
        'projectName': 'Protoboard',
        '$home': 'doc-theme/Home.theme',
        '$class': 'doc-theme/class.theme'
      }));
  });
}

gulp.task('clean', shell.task('rm -r out'));

gulp.task('doc-gen', shell.task('yuidoc --config yuidoc.json'));
gulp.task('demo', function() {
  return gulp.src(['out/**', 'ex/**', 'bower_components/**'], { base: '.' })
      .pipe(gulp.dest('../protoboard-doc'));
});

gulp.task('doc', ['demo', 'doc-gen'], function() {
  return gulp.src(['doc/**'])
      .pipe(gulp.dest('../protoboard-doc'));
});

gulp.task('jshint', function() {
  return gulp.src(['./src/**/*.html', './test/**/*.html'])
      .pipe(plumber())
      .pipe(subJsHint());
})

gulp.task('src', ['jshint'], function() {
  return gulp.src(['./src/**/*.html'])
      .pipe(sub6to5())
      .pipe(subMythHtml())
      .pipe(gulp.dest('out'));
});

gulp.task('ex', ['src'], function() {
  return gulp.src('./ex/**/*.css')
      .pipe(subMyth())
      .pipe(gulp.dest('out/ex'));
});

gulp.task('6to5-test', ['jshint'], function() {
  return gulp.src(['./test/**/*_test.html', './test/testbase.html'])
      .pipe(sub6to5())
      .pipe(gulp.dest('out'));
});

gulp.task('karma', ['src', '6to5-test'], function(done) {
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
        .pipe(sub6to5())
        .pipe(subMythHtml())
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

gulp.task('compile', ['src', '6to5-test']);
gulp.task('pack', ['src', 'ex'], function() {
  return gulp.src('out/**/*')
      .pipe(zip('bin.zip'))
      .pipe(gulp.dest('dist'));
});
gulp.task('check', ['karma']);
gulp.task('push', ['check', 'doc', 'pack'], shell.task('git push'));
