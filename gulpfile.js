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
        VERSION: '2.7.19',
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


gulp.task('dev.setVersion', [
    'dev.setVersion-dist'
], function(callback) {
    callback();
});

gulp.task('dev.setVersion-dist', function() {
    return setVersion.dist(Settings.env.DEV);
});


gulp.task('all.setVersion', [
    'all.setVersion-root',
    'all.setVersion-src',
    'all.setVersion-dist'
], function(callback) {
     callback();
});

gulp.task('all.setVersion-root', function() {
    return setVersion.root(Settings.env.PRD);
});

gulp.task('all.setVersion-src', function() {
    return setVersion.src(Settings.env.PRD);
});

gulp.task('all.setVersion-dist', function() {
    return setVersion.dist(Settings.env.PRD);
});

gulp.task('css.minToJS', function() {
    return gulp.src('dist/queiroz.js')
            .pipe(replace('%css%', fs.readFileSync('src/css/style.min.css', 'utf8')))
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

gulp.task('js.setHeader', function() {
    return gulp.src([
            'src/js/dochead.js',
            'dist/queiroz.min.js'
        ])
        .pipe(concat('queiroz.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('js.concat', function() {
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
    runSequence(
      'js.concat',
      'dev.setVersion',
      'css.compile',
      'js.compress',
      callback
    );
});

gulp.task('release', function(callback) {
    runSequence(
      'js.concat',
      'all.setVersion',
      'css.compile',
      'js.compress',
      'js.setHeader',
      callback
    );
});


gulp.task('default', function() {
    console.log('Please, choose the build mode, like \'gulp [dev,release]\'');
});
