var gulp = require('gulp');
var gutil = require('gulp-util');

var sass   = require('gulp-ruby-sass');

var fs = require('fs');
var through  = require('through2');

function handleError(error) {
  console.log(error.toString());
  this.emit('end');
};

function toJson(element) {
  return through.obj(function(file, enc, cb) {
    var group = [];
    if (file.isBuffer()) {
      var lines = String(file.contents).split('\n');
      for (var i = 1; i < lines.length; i++) {
        var segments = lines[i].split('\t');
        var card = {
          'name': segments[0],
          'type': segments[1],
          'element': element,
          'count': segments[2],
          'description': segments[6],
          'cost': segments[8]
        };

        if (segments[3]) {
          card['life'] = segments[3];
        }

        if (segments[4]) {
          card['attack'] = segments[4];
        }

        if (segments[5]) {
          card['armor'] = segments[5];
        }

        group.push(card);
      }

      this.push(new gutil.File({
        path: 'gz-data-' + element + '.js',
        contents: new Buffer('gz.' + element + ' = ' + JSON.stringify(group, null, 2) + ';')
      }));
    } else {
      throw 'Only supports buffer';
    }

    cb();
  });
}

var elements = ['air', 'earth', 'fire', 'neutral', 'water'];

elements.forEach(function(element) {
  gulp.task('json.' + element, function() {
    return gulp.src(['gazer-' + element + '.tsv'])
        .pipe(toJson(element))
        .pipe(gulp.dest('.'));
  });
});

gulp.task('sass', function() {
  return gulp.src('*.scss')
      .pipe(sass({ loadPath: ['../../src/themes'] }))
      .on('error', handleError)
      .pipe(gulp.dest('.'));
});

gulp.task('json', elements.map(function(element) { return 'json.' + element; }));
gulp.task('watch', function() {
  gulp.watch(['*.scss'], ['sass']);
});

