import gulp        from 'gulp';
import eventStream from 'event-stream';
import {exec}      from 'child_process';
import chalk       from 'chalk';

import remove      from 'rimraf';
import concat      from 'gulp-concat';

import sass        from 'gulp-sass';
import scssLint    from 'gulp-scss-lint';
import cssW3C      from 'gulp-w3c-css';
import parker      from 'gulp-parker';
import minifyCSS   from 'gulp-minify-css';

import paths       from '../config/gulp-paths';


export function combineCSS (callback) {
    var compiled = gulp.src(paths.files.scss).pipe(sass()),
        css      = gulp.src(paths.files.css);

    return eventStream.merge(compiled, css)
            .pipe(concat('main.css').on('end', () => {
                remove(paths.folders.cssTemp + 'main.css', () => {});                
            }))
            .pipe(gulp.dest(paths.folders.cssTemp));
};

export function minifyCssTask () {
    return gulp.src(paths.folders.css + 'main.css')
            .pipe(minifyCSS())
            .pipe(gulp.dest(paths.folders.css));
};

export function compileTestingCSS () {
    return gulp.src(paths.files.scss)
            .pipe(sass())
            .pipe(gulp.dest(paths.folders.cssTemp));
};

export function cssMetricsTask () {
    return gulp.src([paths.files.cssTemp, paths.files.css])
            .pipe(concat('main.css'))
            .pipe(parker());
};

export function w3cCssTest (callback) {
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
};

export function cleanCssTestingTemp (callback) {
    remove(paths.folders.cssTemp, callback);
};

export function cssRedundancyTest (callback) {
    exec('csscss ' + paths.folders.cssTemp + 'main.css', (error, stdout) => {
        if (error) {
            console.log(error);
        } else if (stdout) {
            console.log(stdout);            
        }

        callback();
    });
};

export function scssLintTask () {
    return gulp.src(paths.files.scss)
            .pipe(scssLint());
};