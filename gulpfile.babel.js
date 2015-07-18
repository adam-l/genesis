import gulp         from 'gulp';
import eventStream  from 'event-stream';
import runSequence  from 'run-sequence';
import chalk        from 'chalk';

import remove       from 'rimraf';
import concat       from 'gulp-concat';

import nameLint     from 'name-lint';

import swig         from 'gulp-swig'
import htmlHint     from 'gulp-htmlhint';
import htmlW3C      from 'gulp-w3cjs';
import htmlWCAG     from 'gulp-accessibility';

import sass         from 'gulp-sass';
import scssLint     from 'gulp-scss-lint';
import cssW3C       from 'gulp-w3c-css';
import minifyCSS    from 'gulp-minify-css';

var paths = {
    folders: {
        css:     'src/stylesheets/css/',
        cssTemp: 'temp/css-w3c/'
    },
    files: {
        html:    'src/templates/**/*.html',
        swig:    ['src/templates/_swig/**/*.swig', '!src/templates/_swig/**/_*.swig',],
        scss:    'src/stylesheets/**/*.scss',        
        css:     'src/stylesheets/**/*.css',
        js:      'src/scripts/**/*.js',
        cssTemp: 'temp/css-w3c/**/*.css'
    }
};


/* File naming */
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


/* HTML */
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

/* Stylesheets */
gulp.task('css-clean', callback => {
    remove(paths.folders.css + 'main.css', () => {
        callback();
    });
});

gulp.task('css-concat', ['css-clean'], () => {
    var compiled = gulp.src(paths.files.scss).pipe(sass()),
        css      = gulp.src(paths.files.css);

    return eventStream.merge(compiled, css)
            .pipe(concat('main.css'))
            .pipe(gulp.dest(paths.folders.css));
});

gulp.task('css-minify', ['css-concat'], () => {
    return gulp.src(paths.folders.css + 'main.css')
            .pipe(minifyCSS())
            .pipe(gulp.dest(paths.folders.css));
});

gulp.task('css-w3c-clean', callback => {
    remove(paths.folders.cssTemp, callback);
});

gulp.task('css-w3c-compile', ['css-w3c-clean'], () => {
    return gulp.src(paths.files.scss)
            .pipe(sass())
            .pipe(gulp.dest(paths.folders.cssTemp));
});

gulp.task('css-w3c-output', ['css-w3c-compile'], callback => {
    var output = '';

    return gulp.src(paths.files.cssTemp)
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

gulp.task('test:css-w3c', callback => {
    runSequence('css-w3c-output', 'css-w3c-clean', callback);
});

gulp.task('test:scss-lint', () => {
    return gulp.src(paths.files.scss)
            .pipe(scssLint());
});

gulp.task('test:css', callback => {
    runSequence('test:scss-lint', 'test:css-w3c', callback);
});

gulp.task('test', callback => {
    runSequence('test:html', 'test:css', callback);
});


/* Watch */
gulp.task('watch:html', () => {
    gulp.watch([paths.files.html], ['test:html']);
});

gulp.task('watch:css', () => {
    gulp.watch([paths.files.scss], ['scss-lint']);
    gulp.watch([paths.files.scss, paths.files.css], ['css-concat']);
});