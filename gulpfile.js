var
gulp = require('gulp'),
minify = require('gulp-minify');

gulp.task('default', function() {
    gulp.src('src/*.js')
        .pipe(minify({
            ext: {
                min:'.min.js'
            }
        }))
        .pipe(gulp.dest('dist'));
});