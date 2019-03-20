var gulp = require('gulp');
var inlinesource = require('gulp-inline-source');
var injectVersion = require('gulp-inject-version');

gulp.task('inlinesource', function () {
    var options = {
        compress: true,
        svgAsImage: true
    };

    return gulp.src('./src/index.html')
        .pipe(injectVersion({
            replace : /%%GULP_INJECT_VERSION%%/g,
            prepend : 'v'
        }))
        .pipe(inlinesource(options))
        .pipe(gulp.dest('./'));
});