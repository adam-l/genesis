// Tools
import gulp                  from 'gulp';
import runSequence           from 'run-sequence';

import nameLint              from 'name-lint';

// Tasks
import {htmlHintTask}        from './_gulp-html';
import {htmlW3cTask}         from './_gulp-html';
import {htmlWcagTask}        from './_gulp-html';
import {swigCompile}         from './_gulp-html';

import {combineCSS}          from './_gulp-stylesheets';
import {minifyCssTask}       from './_gulp-stylesheets';
import {compileTestingCSS}   from './_gulp-stylesheets';
import {cssMetricsTask}      from './_gulp-stylesheets';
import {w3cCssTest}          from './_gulp-stylesheets';
import {cleanCssTestingTemp} from './_gulp-stylesheets';
import {cssRedundancyTest}   from './_gulp-stylesheets';
import {scssLintTask}        from './_gulp-stylesheets';

// Paths
import paths                 from '../config/gulp-paths';


// File naming
gulp.task('test:names', callback => {
    var regularExpression = /^_?[a-z0-9\-]+$/;

    nameLint('../src/', {
        'dirFormat': regularExpression,
        'fileFormats': {
            '.*': regularExpression
        },
        'exclude': [
            'node_modules'
        ],
    }, (error, matches) => {
        if (error) {
            throw error
        }

        console.log(matches.join('\n'));
        callback();
    });
});

// HTML
gulp.task('html-hint', htmlHintTask);
gulp.task('html-w3c', htmlW3cTask);
gulp.task('html-wcag', htmlWcagTask);
gulp.task('swig-compile', swigCompile);
gulp.task('test:html', callback => {
    runSequence('html-hint', 'html-w3c', 'html-wcag', callback);
});

// Stylesheets
gulp.task('css-concat', combineCSS);
gulp.task('css-minify', ['css-concat'], minifyCssTask);
gulp.task('compile-test-css', ['clean-css-testing-temp'], compileTestingCSS);
gulp.task('test:css-metrics', ['compile-test-css'], cssMetricsTask);
gulp.task('test:css-w3c', ['compile-test-css'], w3cCssTest);
gulp.task('clean-css-testing-temp', cleanCssTestingTemp);
gulp.task('test:css-redundancy', ['css-concat'], cssRedundancyTest);
gulp.task('test:scss-lint', scssLintTask);
gulp.task('test:css', callback => {
    runSequence('test:scss-lint', 'test:css-w3c', 'test:css-metrics', 'test:css-redundancy', 'clean-css-testing-temp', callback);
});
gulp.task('test', callback => {
    runSequence('test:names', 'test:html', 'test:css', callback);
});


// Watch 
gulp.task('watch:html', () => {
    gulp.watch([paths.files.html], ['test:html']);
});

gulp.task('watch:css', () => {
    gulp.watch([paths.files.scss], ['test:scss-lint']);
    gulp.watch([paths.files.scss, paths.files.css], ['css-concat']);
});