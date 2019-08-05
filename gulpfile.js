const { version } = require('./package.json');
const gulp = require('gulp');
const zip = require('gulp-zip');
const inlinesource = require('gulp-inline-source');
const injectVersion = require('gulp-inject-version');
const rename = require("gulp-rename");


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
        .pipe(gulp.dest('./'))
        .pipe(rename(function (path) {
            path.basename = `bip39split-${version}`;
          }))
        .pipe(zip(`bip39split-${version}.zip`))
        .pipe(gulp.dest('./'));
});