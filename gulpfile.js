var
    gulp = require('gulp'),
    replace = require('gulp-replace'),
    minify = require('gulp-minify'),
    cleanCSS = require('gulp-clean-css'),
    runSequence = require('run-sequence'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    fs = require('fs')
;

var
    currentDateTimeToString = function() {
        var
          now = new Date(),
          normalize = function(number) {
              return (number < 10 ? '0' + number : number);
          },
          year = now.getFullYear(),
          month = normalize(now.getMonth()+1),
          day = normalize(now.getDate()),
          dateString = ''+year+month+day,
          timeString = now.toTimeString().split(' ')[0];

        return (dateString + timeString).replace(/\D/g,'');
    },

    Settings = {
        VERSION: '2.8.6',
        versionRegex: '(?:\\d+\\.){2}\\d+(?:-beta\\.\\d+)?',
        env: {
            DEV: {
                versionReplacer: function(match, $1) {
                    var devVersion = '-beta.' + currentDateTimeToString();
                    return ($1 || '') + Settings.VERSION + devVersion;
                }
            },
            PRD: {
                versionReplacer: function(match, $1) {
                    return ($1 || '') + Settings.VERSION;
                }
            }
        }
    }
;

var
    setVersion = {
        root: function(env) {
            return gulp
                .src([
                    './README.md',   // Queiroz.js 2.2.3
                    './package.json' // "version": "2.2.3"
                ])
                .pipe(replace(new RegExp('(js )'+Settings.versionRegex), env.versionReplacer))
                .pipe(replace(new RegExp('(version.{4})'+Settings.versionRegex), env.versionReplacer))
                .pipe(gulp.dest('./'));
        },
        dist: function(env) {
            return gulp
                .src([
                    'dist/queiroz.js',
                    'dist/queiroz.min.js'
                ])
                .pipe(replace('__version__', env.versionReplacer))
                .pipe(gulp.dest('dist'));
            }
    }
;


gulp.task('dev.version', function() {
    return setVersion.dist(Settings.env.DEV);
});

gulp.task('all.version', [
    'all.version-root',
    'all.version-dist'
], function(callback) {
     callback();
});

gulp.task('all.version-root', function() {
    return setVersion.root(Settings.env.PRD);
});

gulp.task('all.version-dist', function() {
    return setVersion.dist(Settings.env.PRD);
});

gulp.task('css.minToJS', function() {
    return gulp.src('dist/queiroz.js')
            .pipe(replace('__css__', fs.readFileSync('src/css/style.min.css', 'utf8')))
            .pipe(gulp.dest('dist'));
});

gulp.task('css.compress', function() {
    return gulp.src('src/css/style.css')
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('src/css'));
});

gulp.task('css.compile', function(callback) {
    runSequence('css.compress', 'css.minToJS', callback);
});

gulp.task('js.compress', function() {
    return gulp.src('dist/queiroz.js')
        .pipe(minify({
           ext: {
               min:'.min.js'
           }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('js.docToMin', function() {
    return gulp.src([
            'src/js/dochead.js',
            'dist/queiroz.min.js'
        ])
        .pipe(concat('queiroz.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('js.concat', function() {
    return gulp.src([
            'src/js/queiroz.js',
            'src/js/kairos.js',
            'src/js/snippet.js',
            'src/js/view.js',
            'src/js/time.js',
            'src/js/util.js',
            'src/js/core.js',
            'src/js/autoexec.js'
        ])
        .pipe(concat('queiroz.js'))
        .pipe(gulp.dest('dist'));
});


gulp.task('dev', function(callback) {
    runSequence(
      'js.concat',
      'css.compile',
      'js.compress',
      'dev.version',
      callback
    );
});

gulp.task('release', function(callback) {
    runSequence(
      'js.concat',
      'css.compile',
      'js.compress',
      'js.docToMin',
      'all.version',
      callback
    );
});


gulp.task('default', function() {
    console.log('Queiroz.js '+Settings.VERSION);
});
