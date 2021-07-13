const { src, dest, series } = require('gulp');
const fs = require('fs');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const jsonMinify = require('gulp-jsonminify');
const htmlMinify = require('gulp-htmlmin');
const cssConcat = require('gulp-concat-css');
const cssMinify = require('gulp-clean-css');
const jsConcat = require('gulp-concat');
const jsMinify = require('gulp-minify');

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
        VERSION: '3.8.58',
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
            return src([
                    './README.md',   // Queiroz.js 2.8.12
                    './package.json', // "version": "2.8.12"
                    './queiroz.user.js' // version 2.8.12
                ])
                .pipe(replace(new RegExp('(js\\s+)'+Settings.versionRegex), env.versionReplacer))
                .pipe(replace(new RegExp('(version.{4})'+Settings.versionRegex), env.versionReplacer))
                .pipe(replace(new RegExp('(version\\s+)'+Settings.versionRegex), env.versionReplacer))
                .pipe(dest('./'));
        },
        dist: function(env) {
            return src([
                    'dist/*',
                ])
                .pipe(replace('__version__', env.versionReplacer))
                .on('end', function() {
                    console.log('\n\tQueiroz.js %s\n', env.versionReplacer());
                })
                .pipe(dest('dist'));
            }
    }
;


function _devVersion() {
    return setVersion.dist(Settings.env.DEV);
}

function _allVersionRoot() {
    return setVersion.root(Settings.env.PRD);
}

function _allVersionDist() {
    return setVersion.dist(Settings.env.PRD);
}

const _allVersion = series(_allVersionRoot, _allVersionDist);

function _resourceMinToJS() {
    return src('dist/queiroz.js')
        .pipe(replace('__strings__', fs.readFileSync('build/resource/strings.min.json', 'utf8')))
        .pipe(replace('__settings__', fs.readFileSync('build/resource/settings.min.json', 'utf8')))
        .pipe(dest('dist'));
}

function _resourceCompressSettings() {
    return src('src/resource/settings.json')
        .pipe(jsonMinify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest('build/resource'));
}

function _resourceCompressStrings() {
    return src('src/resource/strings.json')
        .pipe(jsonMinify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest('build/resource'));
}

const _resourceCompress = series(_resourceCompressStrings, _resourceCompressSettings);
const _resourceCompile = series(_resourceCompress, _resourceMinToJS);

function _htmlMinToJS() {
    return src('dist/queiroz.js')
        .pipe(replace('__modal__', fs.readFileSync('build/html/modal.min.html', 'utf8')))
        .pipe(dest('dist'));
}

function _htmlCompress() {
    return src('src/html/modal.html')
        .pipe(htmlMinify({
            collapseWhitespace: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest('build/html'));
}

const _htmlCompile = series(_htmlCompress, _htmlMinToJS);

function _cssMinToJS() {
    return src('dist/queiroz.js')
        .pipe(replace('__css__', fs.readFileSync('build/css/queiroz.min.css', 'utf8')))
        .pipe(dest('dist'));
}

function _cssCompress() {
    return src('build/css/queiroz.css')
        .pipe(cssMinify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest('build/css'));
}

function _cssConcat() {
    return src([
            'src/css/normalize.css',
            'src/css/kairos.css',
            'src/css/queiroz.css'
        ])
        .pipe(cssConcat('queiroz.css'))
        .pipe(dest('build/css'));
}

const _cssCompile = series(_cssConcat, _cssCompress, _cssMinToJS);

function _jsCompress() {
    return src('dist/queiroz.js')
        .pipe(jsMinify({
           ext: {
               min:'.min.js'
           }
        }))
        .pipe(dest('dist'));
}

function _jsDocToMin() {
    return src([
            'src/js/dochead.js',
            'dist/queiroz.min.js'
        ])
        .pipe(jsConcat('queiroz.min.js'))
        .pipe(dest('dist'));
}

function _devConcat() {
    return src([
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
        .pipe(dest('dist'));
}

function _allConcat() {
    return src([
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
        .pipe(dest('dist'));
}

const _commons = series(
    _cssCompile,
    _htmlCompile,
    _resourceCompile,
    _jsCompress,
);

exports.dev = series(
    _devConcat,
    _commons,
    _devVersion,
);

exports.default = series(
    _allConcat,
    _commons,
    _jsDocToMin,
    _allVersion,
);