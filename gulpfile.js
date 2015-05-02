var gulp    = require('gulp');
var debug   = require('gulp-debug');
var plumber = require('gulp-plumber');

var babel  = require('gulp-babel');
var jshint = require('gulp-jshint');
var myth   = require('gulp-myth');
var shell  = require('gulp-shell');
var subs   = require('gulp-html-subs');
var zip    = require('gulp-zip');

var chalk    = require('chalk');
var karma    = require('karma').server;
var minimist = require('minimist');
var through  = require('through2');
var loadtheme = require('./loadtheme');

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

function subBabel() {
  return chain(function(stream) {
    var scriptSubs = subs('script');
    return stream
        .pipe(scriptSubs.extract)
            .pipe(babel({modules: 'ignore', comments: false}))
        .pipe(scriptSubs.inject);
  });
}

function subMyth() {
  return chain(function(stream) {
    return stream
        .pipe(myth({ 'variables': loadtheme(options.theme) }));
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

gulp.task('copy', ['copy-babel-polyfill'], function() {
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
});

gulp.task('copy-babel-polyfill', function() {
  return gulp
      .src([
          'node_modules/gulp-babel/node_modules/babel-core/browser-polyfill.js',
        ],
        { base: 'node_modules/gulp-babel/node_modules' })
      .pipe(gulp.dest('out/third_party'));

});

gulp.task('clean', shell.task('rm -r out doc'));

gulp.task('doc-gen', shell.task('yuidoc --config yuidoc.json'));

gulp.task('doc', ['doc-gen'], function() {
  return gulp.src(['doc/**'])
      .pipe(gulp.dest('../protoboard-doc'));
});

gulp.task('jshint', function() {
  return gulp.src(['./src/**/*.html', './test/**/*.html'])
      .pipe(plumber())
      .pipe(subJsHint());
})

gulp.task('src', ['jshint', 'copy'], function() {
  return gulp.src(['./src/**/*.html'])
      .pipe(subBabel())
      .pipe(subMythHtml())
      .pipe(gulp.dest('out'));
});

gulp.task('test', ['jshint'], function() {
  return gulp.src(['./test/**/*_test.html', './test/testbase.html'])
      .pipe(subBabel())
      .pipe(gulp.dest('out'));
});

gulp.task('karma', ['compile'], function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('karma-dev', ['compile'], function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done);
});

gulp.task('watch', ['compile'], function() {
  // src
  gulp.watch(['src/**/*.html', 'test/**/*.html'], function(event) {
    var base = event.path.substring(__dirname.length).split('/')[1];
    gulp.src(event.path, {base: base})
        .pipe(plumber())
        .pipe(subBabel())
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

gulp.task('compile', ['src', 'test', 'copy']);
gulp.task('pack', ['src', 'check', 'doc'], function() {
  return gulp.src('out/**/*')
      .pipe(zip('bin.zip'))
      .pipe(gulp.dest('dist'));
});
gulp.task('check', ['karma']);
