var
    gulp = require('gulp'),
    replace = require('gulp-replace')
    minify = require('gulp-minify')
;

var
    Settings = {
        VERSION: '2.3.0'
    }
;

gulp.task('set-dev-version', function() {
    var
        replacer = function(match, $1, $2) {
            var devVersion = parseInt($2 || 0) + 1,
                generatedVersion = [Settings.VERSION, devVersion].join('.');
            return $1+generatedVersion;
        };

    gulp
        .src('./README.md') // Queiroz.js 2.2.3.43
        .pipe(replace(/(js )(?:\d\.){2}\d(?:\.(\d+))?/, replacer))
        .pipe(gulp.dest('./'));
    gulp
        .src('./package.json') // "version": "2.2.3.43"
        .pipe(replace(/(version.{4})(?:\d\.){2}\d(?:\.(\d+))?/, replacer))
        .pipe(gulp.dest('./'));
    gulp
        .src('src/queiroz.js') // Queiroz.js 2.2.3.43
        .pipe(replace(/(js )(?:\d\.){2}\d(?:\.(\d+))?/, replacer))
        .pipe(replace(/(VERSION.{4})(?:\d\.){2}\d(?:\.(\d+))?/, replacer))
        .pipe(gulp.dest('src'));
});

gulp.task('set-version', function() {
    var
        replacer = function(match, $1) {
            return $1+Settings.VERSION;
        };

    gulp
        .src('./README.md') // Queiroz.js 2.2.3.43
        .pipe(replace(/(js )(?:\d\.){2}\d(?:\.\d+)?/, replacer))
        .pipe(gulp.dest('./'));
    gulp
        .src('./package.json') // "version": "2.2.3.43"
        .pipe(replace(/(version.{4})(?:\d\.){2}\d(?:\.\d+)?/, replacer))
        .pipe(gulp.dest('./'));
    gulp
        .src('src/queiroz.js') // Queiroz.js 2.2.3.43
        .pipe(replace(/(js )(?:\d\.){2}\d(?:\.\d+)?/, replacer))
        .pipe(replace(/(VERSION.{4})(?:\d\.){2}\d(?:\.\d+)?/, replacer))
        .pipe(gulp.dest('src'));
});

gulp.task('minify', function() {
    gulp.src('src/*.js')
        .pipe(minify({
           ext: {
               min:'.min.js'
           }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('dev', ['set-dev-version', 'minify']);

gulp.task('release', ['set-version', 'minify']);

gulp.task('default', function() {
    console.log('Please, choose the build mode, like \'gulp [dev,release]\'');
});