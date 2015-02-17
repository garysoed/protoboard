var gulp = require('gulp');
var gutil = require('gulp-util');

var sass   = require('gulp-ruby-sass');

var fs = require('fs');
var through  = require('through2');

function handleError(error) {
  console.log(error.toString());
  this.emit('end');
};

function toJson() {
  return through.obj(function(file, enc, cb) {
    var elements = {};
    if (file.isBuffer()) {
      var lines = String(file.contents).split('\n');
      for (var i = 1; i < lines.length; i++) {
        var segments = lines[i].split('\t');
        var card = {
          'name': segments[0],
          'type': segments[2],
          'element': segments[1],
          'count': segments[3],
          'description': segments[7],
          'cost': segments[12]
        };

        if (segments[4]) {
          card['life'] = segments[4];
        }

        if (segments[5]) {
          card['attack'] = segments[5];
        }

        if (segments[6]) {
          card['armor'] = segments[6];
        }

        if (!elements[card.element]) {
          elements[card.element] = [];
        }
        elements[card.element].push(card);
      }

      this.push(new gutil.File({
        path: 'gz-data.js',
        contents: new Buffer('gz.cards = ' + JSON.stringify(elements, null, 2) + ';')
      }));
    } else {
      throw 'Only supports buffer';
    }

    cb();
  });
}

gulp.task('sass', function() {
  return gulp.src('*.scss')
      .pipe(sass({ loadPath: ['../../src/themes'] }))
      .on('error', handleError)
      .pipe(gulp.dest('.'));
});

gulp.task('json', function() {
  return gulp.src('gazer.tsv')
      .pipe(toJson())
      .pipe(gulp.dest('.'));
});
gulp.task('watch', function() {
  gulp.watch(['*.scss'], ['sass']);
});

