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
    Settings = {
        VERSION: '2.7.13',
        versionRegex: '(?:\\d+\\.){2}\\d+(?:-beta\\.\\d+)?',
        env: {
            DEV: {
                versionReplacer: function(match, $1) {
                    var devVersion = '-beta.' + new Date().toLocaleString().replace(/\D/g,'');
                    return $1 + Settings.VERSION + devVersion;
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
        root: function(env) {
            return gulp
                .src([
                    './README.md',   // Queiroz.js 2.2.3-beta.1234567890'
                    './package.json' // "version": "2.2.3-beta.1234567890'"
                ])
                .pipe(replace(new RegExp('(js )'+Settings.versionRegex), env.versionReplacer))
                .pipe(replace(new RegExp('(version.{4})'+Settings.versionRegex), env.versionReplacer))
                .pipe(gulp.dest('./'));
        },
        src: function(env) {
            return gulp
                .src('src/js/dochead.js')
                .pipe(replace(new RegExp('(js )'+Settings.versionRegex), env.versionReplacer)) // Queiroz.js 2.2.3-beta.1234567890'
                .pipe(gulp.dest('src/js'));
        },
        dist: function(env) {
            return gulp
                .src('dist/queiroz.js')
                .pipe(replace(new RegExp('(VERSION.{4})'+Settings.versionRegex), env.versionReplacer)) // VERSION = '2.2.3-beta.1234567890'
                .pipe(gulp.dest('dist'));
            }
    }
;


gulp.task('set-dev-version', [
    'set-dev-version-dist'
], function(callback) {
    callback();
});

gulp.task('set-dev-version-dist', function() {
    return setVersion.dist(Settings.env.DEV);
});


gulp.task('set-version', [
    'set-version-root',
    'set-version-src',
    'set-version-dist'
], function(callback) {
     callback();
});

gulp.task('set-version-root', function() {
    return setVersion.root(Settings.env.PRD);
});

gulp.task('set-version-src', function() {
    return setVersion.src(Settings.env.PRD);
});

gulp.task('set-version-dist', function() {
    return setVersion.dist(Settings.env.PRD);
});

gulp.task('style-replace', function() {
    return gulp.src('dist/queiroz.js')
            .pipe(replace('%css%', fs.readFileSync('src/css/style.min.css', 'utf8')))
            .pipe(gulp.dest('dist'));
});

gulp.task('style-compress', function() {
    return gulp.src('src/css/style.css')
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('src/css'));
});

gulp.task('style', function(callback) {
    runSequence('style-compress', 'style-replace', callback);
});

gulp.task('compress', function() {
    return gulp.src('dist/queiroz.js')
        .pipe(minify({
           ext: {
               min:'.min.js'
           }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('concat-min', function() {
    return gulp.src([
            'src/js/dochead.js',
            'dist/queiroz.min.js'
        ])
        .pipe(concat('queiroz.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('concat', function() {
    return gulp.src([
            'src/js/snippet.js',
            'src/js/view.js',
            'src/js/time.js',
            'src/js/util.js',
            'src/js/main.js',
            'src/js/autoexec.js'
        ])
        .pipe(concat('queiroz.js'))
        .pipe(gulp.dest('dist'));
});


gulp.task('dev', function(callback) {
    runSequence('concat','set-dev-version','style','compress', callback);
});

gulp.task('release', function(callback) {
    runSequence('concat','set-version','style','compress','concat-min', callback);
});


gulp.task('default', function() {
    console.log('Please, choose the build mode, like \'gulp [dev,release]\'');
});