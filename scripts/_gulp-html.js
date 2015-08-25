import gulp     from 'gulp';

import swig     from 'gulp-swig'
import htmlHint from 'gulp-htmlhint';
import htmlW3C  from 'gulp-w3cjs';
import htmlWCAG from 'gulp-accessibility';

import paths    from '../config/gulp-paths';


export function htmlHintTask () {
    return gulp.src(paths.files.html)
            .pipe(htmlHint())
            .pipe(htmlHint.reporter());
}

export function htmlW3cTask () {
    return gulp.src(paths.files.html)
            .pipe(htmlW3C());
}

export function htmlWcagTask () {
    return gulp.src(paths.files.html)
            .pipe(htmlWCAG({}));
};

export function swigCompile () {
    return gulp.src(paths.files.swig)
            .pipe(swig())
            .pipe(gulp.dest('../temp/html'));
};