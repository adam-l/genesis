// Tools
import gulp        from 'gulp';
import {exec}      from 'child_process';
import eventStream from 'event-stream';
import runSequence from 'run-sequence';
import chalk       from 'chalk';

import remove      from 'rimraf';
import concat      from 'gulp-concat';

import nameLint    from 'name-lint';

import swig        from 'gulp-swig'
import htmlHint    from 'gulp-htmlhint';
import htmlW3C     from 'gulp-w3cjs';
import htmlWCAG    from 'gulp-accessibility';

import sass        from 'gulp-sass';
import scssLint    from 'gulp-scss-lint';
import cssW3C      from 'gulp-w3c-css';
import parker      from 'gulp-parker';
import minifyCSS   from 'gulp-minify-css';

// Paths
import paths       from './config/gulp-paths';


// File naming
gulp.task('name-lint', callback => {
    var regularExpression = /^_?[a-z0-9\-]+$/;

    nameLint('src/', {
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
gulp.task('html-hint', () => {
    return gulp.src(paths.files.html)
            .pipe(htmlHint())
            .pipe(htmlHint.reporter());
});

gulp.task('html-w3c', () => {
    return gulp.src(paths.files.html)
            .pipe(htmlW3C());
});

gulp.task('html-wcag', () => {
    return gulp.src(paths.files.html)
            .pipe(htmlWCAG({}));
});

gulp.task('swig-compile', () => {
    return gulp.src(paths.files.swig)
            .pipe(swig())
            .pipe(gulp.dest('temp/html'));
});

gulp.task('test:html', callback => {
    runSequence('html-hint', 'html-w3c', 'html-wcag', callback);
});


// Stylesheets
gulp.task('css-concat', (callback) => {
    var compiled = gulp.src(paths.files.scss).pipe(sass()),
        css      = gulp.src(paths.files.css);

    return eventStream.merge(compiled, css)
            .pipe(concat('main.css').on('end', () => {
                remove(paths.folders.cssTemp + 'main.css', () => {});                
            }))
            .pipe(gulp.dest(paths.folders.cssTemp));
});

gulp.task('css-minify', ['css-concat'], () => {
    return gulp.src(paths.folders.css + 'main.css')
            .pipe(minifyCSS())
            .pipe(gulp.dest(paths.folders.css));
});

gulp.task('compile-test-css', ['clean-css-testing-temp'], () => {
    return gulp.src(paths.files.scss)
            .pipe(sass())
            .pipe(gulp.dest(paths.folders.cssTemp));
});

gulp.task('test:css-metrics', ['compile-test-css'], () => {
    return gulp.src([paths.files.cssTemp, paths.files.css])
            .pipe(concat('main.css'))
            .pipe(parker());
});

gulp.task('test:css-w3c', ['compile-test-css'], callback => {
    var output = '';

    gulp.src([paths.files.cssTemp, paths.files.css])
        .pipe(cssW3C())
        .pipe(eventStream.through(file => {
            var fileValidationResults = JSON.parse(file.contents.toString());

            output += 'Tested file: ' + chalk.underline(file.relative) + '\n';

            Object.keys(fileValidationResults).forEach(messageType => {
                output += chalk.bgRed.bold('Number of ' + messageType + ' found: '
                                             + (fileValidationResults[messageType].length || 0)) + '\n';

                fileValidationResults[messageType].forEach(message => {
                    output += chalk.bgWhite.black(message.line) + ' ';
                    output += message.context ? chalk.bgBlack.bold(message.context) + ' ' : '';
                    output += message.message.replace(/\s\s+/g, ' ') + (messageType === 'warnings' ? '\n' : '');
                    output += message.skippedString ? message.skippedString.replace(/\s\s+/g, ' ') + '\n' : '';
                });
            });
        }, () => {
            if (output) {
                console.log(output);
            };

            callback();
        }));
});

gulp.task('clean-css-testing-temp', callback => {
    remove(paths.folders.cssTemp, callback);
});

gulp.task('test:css-redundancy', ['css-concat'], callback => {
    exec('csscss ' + paths.folders.cssTemp + 'main.css', (error, stdout) => {
        if (error) {
            console.log(error);
        } else if (stdout) {
            console.log(stdout);            
        }

        callback();
    });
});

gulp.task('test:scss-lint', () => {
    return gulp.src(paths.files.scss)
            .pipe(scssLint());
});

gulp.task('test:css', callback => {
    runSequence('test:scss-lint', 'test:css-w3c', 'test:css-metrics', 'test:css-redundancy', 'clean-css-testing-temp', callback);
});

gulp.task('test', callback => {
    runSequence('test:html', 'test:css', callback);
});


// Watch 
gulp.task('watch:html', () => {
    gulp.watch([paths.files.html], ['test:html']);
});

gulp.task('watch:css', () => {
    gulp.watch([paths.files.scss], ['scss-lint']);
    gulp.watch([paths.files.scss, paths.files.css], ['css-concat']);
});