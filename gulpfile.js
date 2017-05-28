var
    gulp = require('gulp'),
    replace = require('gulp-replace'),
    minify = require('gulp-minify'),
    runSequence = require('run-sequence')
;

var
    Settings = {
        VERSION: '2.4.3',
        versionRegex: '(?:\\d\\.){2}\\d(?:\\.(\\d+))?',
        env: {
            DEV: {
                versionReplacer: function(match, $1, $2) {
                    var
                        devVersion = parseInt($2 || 0) + 1,
                        generatedVersion = [Settings.VERSION, devVersion].join('.');

                    return $1 + generatedVersion;
                }
            },
            PRD: {
                versionReplacer: function(match, $1) {
                    return $1 + Settings.VERSION;
                }
            }
        }
    }
;

var
    setVersion = {
        readme: function(env) {
            return gulp
                .src('./README.md') // Queiroz.js 2.2.3.43
                .pipe(replace(new RegExp('(js )'+Settings.versionRegex), env.versionReplacer))
                .pipe(gulp.dest('./'));
        },
        package: function(env) {
            return gulp
                .src('./package.json') // "version": "2.2.3.43"
                .pipe(replace(new RegExp('(version.{4})'+Settings.versionRegex), env.versionReplacer))
                .pipe(gulp.dest('./'));
        },
        queiroz: function(env) {
            return gulp
                .src('src/queiroz.js')
                .pipe(replace(new RegExp('(js )'+Settings.versionRegex), env.versionReplacer)) // Queiroz.js 2.2.3.43
                .pipe(replace(new RegExp('(VERSION.{4})'+Settings.versionRegex), env.versionReplacer)) // VERSION = '2.2.3.43'
                .pipe(gulp.dest('src'));
        }
    }
;


gulp.task('set-dev-version', [
    'set-dev-version-readme',
    'set-dev-version-package',
    'set-dev-version-queiroz'
], function(callback) {
    callback();
});

gulp.task('set-dev-version-readme', function() {
    return setVersion.readme(Settings.env.DEV);
});

gulp.task('set-dev-version-package', function() {
    return setVersion.package(Settings.env.DEV);
});

gulp.task('set-dev-version-queiroz', function() {
    return setVersion.queiroz(Settings.env.DEV);
});


gulp.task('set-version', [
    'set-version-readme',
    'set-version-package',
    'set-version-queiroz'
], function(callback) {
     callback();
});

gulp.task('set-version-readme', function() {
    return setVersion.readme(Settings.env.PRD);
});

gulp.task('set-version-package', function() {
    return setVersion.package(Settings.env.PRD);
});

gulp.task('set-version-queiroz', function() {
    return setVersion.queiroz(Settings.env.PRD);
});


gulp.task('compress', function() {
    return gulp.src('src/queiroz.js')
        .pipe(minify({
           ext: {
               min:'.min.js'
           }
        }))
        .pipe(gulp.dest('dist'));
});


gulp.task('dev', function(callback) {
    runSequence('set-dev-version', 'compress', callback);
});

gulp.task('release', function(callback) {
    runSequence('set-version', 'compress', callback);
});


gulp.task('default', function() {
    console.log('Please, choose the build mode, like \'gulp [dev,release]\'');
});