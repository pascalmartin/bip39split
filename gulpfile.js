var gulp = require('gulp');
var inlinesource = require('gulp-inline-source');

gulp.task('inlinesource', function () {
    var options = {
        compress: true
    };

    return gulp.src('./src/index.html')
        .pipe(inlinesource(options))
        .pipe(gulp.dest('./'));
});