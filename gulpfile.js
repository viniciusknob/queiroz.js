var
    gulp = require('gulp'),
    fs = require('fs'),
    replace = require('gulp-replace'),
    jsConcat = require('gulp-concat'),
    cssConcat = require('gulp-concat-css'),
    rename = require('gulp-rename'),
    jsMinify = require('gulp-minify'),
    cssMinify = require('gulp-clean-css'),
    htmlMinify = require('gulp-htmlmin'),
    jsonMinify = require('gulp-jsonminify'),
    runSequence = require('run-sequence');

// Polyfill
Number.prototype.padStart = function(length) {
    var _number = ''+this;
    while(_number.length < length)
        _number = '0'+_number;
    return _number;
};
Date.prototype.getFixedMonth = function() {
    return this.getMonth() + 1;
};

var
    currentDateTimeToString = function() {
        var
          now = new Date(),
          year = now.getFullYear(),
          month = now.getFixedMonth().padStart(2),
          day = now.getDate().padStart(2),
          dateString = ''+year+month+day,
          timeString = now.toTimeString().split(' ')[0];

        return (dateString + timeString).replace(/\D/g,'');
    },

    Settings = {
        VERSION: '3.8.53',
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
                    './README.md',   // Queiroz.js 2.8.12
                    './package.json', // "version": "2.8.12"
                    './queiroz.user.js' // version 2.8.12
                ])
                .pipe(replace(new RegExp('(js\\s+)'+Settings.versionRegex), env.versionReplacer))
                .pipe(replace(new RegExp('(version.{4})'+Settings.versionRegex), env.versionReplacer))
                .pipe(replace(new RegExp('(version\\s+)'+Settings.versionRegex), env.versionReplacer))
                .pipe(gulp.dest('./'));
        },
        dist: function(env) {
            return gulp
                .src([
                    'dist/queiroz.js',
                    'dist/queiroz.min.js'
                ])
                .pipe(replace('__version__', env.versionReplacer))
                .on('end', function() {
                    console.log('\n\tQueiroz.js %s\n', env.versionReplacer());
                })
                .pipe(gulp.dest('dist'));
            }
    }
;


gulp.task('dev.version', function() {
    return setVersion.dist(Settings.env.DEV);
});

gulp.task('all.version-root', function() {
    return setVersion.root(Settings.env.PRD);
});

gulp.task('all.version-dist', function() {
    return setVersion.dist(Settings.env.PRD);
});

gulp.task('all.version', function(callback) {
    runSequence('all.version-root', 'all.version-dist', callback);
});

gulp.task('resource.minToJS', function() {
    return gulp.src('dist/queiroz.js')
        .pipe(replace('__strings__', fs.readFileSync('build/resource/strings.min.json', 'utf8')))
        .pipe(replace('__settings__', fs.readFileSync('build/resource/settings.min.json', 'utf8')))
        .pipe(gulp.dest('dist'));
});

gulp.task('resource.compress.settings', function() {
    return gulp.src('src/resource/settings.json')
        .pipe(jsonMinify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/resource'));
});

gulp.task('resource.compress.strings', function() {
    return gulp.src('src/resource/strings.json')
        .pipe(jsonMinify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/resource'));
});

gulp.task('resource.compress', function(callback) {
    runSequence('resource.compress.strings', 'resource.compress.settings', callback);
});

gulp.task('resource.compile', function(callback) {
    runSequence('resource.compress', 'resource.minToJS', callback);
});

gulp.task('html.minToJS', function() {
    return gulp.src('dist/queiroz.js')
        .pipe(replace('__modal__', fs.readFileSync('build/html/modal.min.html', 'utf8')))
        .pipe(gulp.dest('dist'));
});

gulp.task('html.compress', function() {
    return gulp.src('src/html/modal.html')
        .pipe(htmlMinify({
            collapseWhitespace: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/html'));
});

gulp.task('html.compile', function(callback) {
    runSequence('html.compress', 'html.minToJS', callback);
});

gulp.task('css.minToJS', function() {
    return gulp.src('dist/queiroz.js')
        .pipe(replace('__css__', fs.readFileSync('build/css/queiroz.min.css', 'utf8')))
        .pipe(gulp.dest('dist'));
});

gulp.task('css.compress', function() {
    return gulp.src('build/css/queiroz.css')
        .pipe(cssMinify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/css'));
});

gulp.task('css.concat', function() {
    return gulp.src([
            'src/css/normalize.css',
            'src/css/kairos.css',
            'src/css/queiroz.css'
        ])
        .pipe(cssConcat('queiroz.css'))
        .pipe(gulp.dest('build/css'));
});

gulp.task('css.compile', function(callback) {
    runSequence('css.concat', 'css.compress', 'css.minToJS', callback);
});

gulp.task('js.compress', function() {
    return gulp.src('dist/queiroz.js')
        .pipe(jsMinify({
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
        .pipe(jsConcat('queiroz.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('dev.concat', function() {
    return gulp.src([
            'src/js/queiroz.js',
            'src/js/polyfill.js',
            'src/js/settings.js',
            'src/js/kairos.js',
            'src/js/keepalive.js',
            'src/js/strings.js',
            'src/js/style.js',
            'src/js/time.js',
            'src/js/dailygoal.js',
            'src/js/dayoff.js',
            'src/js/viewtime.js',
            'src/js/snippet.js',
            'src/js/timeon.js',
            'src/js/notice.js',
            'src/js/view.js',
            'src/js/modal.js',
            'src/js/report.js',
            'src/js/mocktime.js',
            'src/js/core.js',
            'src/js/autoexec.js'
        ])
        .pipe(jsConcat('queiroz.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('all.concat', function() {
    return gulp.src([
            'src/js/queiroz.js',
            'src/js/polyfill.js',
            'src/js/settings.js',
            'src/js/analytics.js',
            'src/js/kairos.js',
            'src/js/keepalive.js',
            'src/js/strings.js',
            'src/js/style.js',
            'src/js/time.js',
            'src/js/dailygoal.js',
            'src/js/dayoff.js',
            'src/js/viewtime.js',
            'src/js/snippet.js',
            'src/js/timeon.js',
            'src/js/notice.js',
            'src/js/view.js',
            'src/js/modal.js',
            'src/js/report.js',
            'src/js/mocktime.js',
            'src/js/core.js',
            'src/js/autoexec.js'
        ])
        .pipe(jsConcat('queiroz.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('commons', function(callback) {
    runSequence(
      'css.compile',
      'html.compile',
      'resource.compile',
      'js.compress',
      callback
    );
});

gulp.task('dev', function(callback) {
    runSequence(
      'dev.concat',
      'commons',
      'dev.version',
      callback
    );
});

gulp.task('release', function(callback) {
    runSequence(
      'all.concat',
      'commons',
      'js.docToMin',
      'all.version',
      callback
    );
});


gulp.task('default', function() {
    console.log('Queiroz.js '+Settings.VERSION);
});
