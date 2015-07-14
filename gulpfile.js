var gulp        = require('gulp'),
    remove      = require('gulp-rimraf'),
    eventStream = require('event-stream'),

    nameLint    = require('name-lint'),

    htmlHint    = require('gulp-htmlhint'),
    htmlW3C     = require('gulp-w3cjs'),
    htmlWCAG    = require('gulp-accessibility'),

    sass        = require('gulp-sass'),
    scsslint    = require('gulp-scss-lint'),
    minifyCSS   = require('gulp-minify-css'),
    concat      = require('gulp-concat'),

    paths       = {
        files: {
            html: 'src/templates/**/*.html',
            css:  'src/stylesheets/**/*.css',
            scss: 'src/stylesheets/**/*.scss',
            js:   'src/scripts/**/*.js'
        },
        folders: {
            css: 'src/stylesheets/css/'    
        }
    };


/* File naming */
gulp.task('name-lint', function (callback) {
    var regularExpression = /^_?[a-z0-9\-]+$/;

    nameLint('src/', {
        'dirFormat': regularExpression,
        'fileFormats': {
            '.*': regularExpression
        },
        'exclude': [
            'node_modules'
        ],
    }, function (error, matches) {
        if (error) {
            throw error
        }

        console.log(matches.join('\n'));
        callback();
    });
});


/* HTML */
gulp.task('html-hint', function () {
    return gulp.src(paths.files.html)
            .pipe(htmlHint())
            .pipe(htmlHint.reporter());
});

gulp.task('html-w3c', function () {
    return gulp.src(paths.files.html)
            .pipe(htmlW3C());
});

gulp.task('html-wcag', function () {
    return gulp.src(paths.files.html)
            .pipe(htmlWCAG({}));
});

gulp.task('test:html', ['html-hint', 'html-w3c', 'html-wcag']);


/* Stylesheets */
gulp.task('css-clean', function () {
    return gulp.src(paths.folders.css + 'main.css')
            .pipe(remove());
});

gulp.task('css-concat', ['css-clean'], function () {
    var compiled = gulp.src(paths.files.scss).pipe(sass()),
        css      = gulp.src(paths.files.css);

    return eventStream.merge(compiled, css)
            .pipe(concat('main.css'))
            .pipe(gulp.dest(paths.folders.css));
});

gulp.task('css-minify', ['css-concat'], function () {
    return gulp.src(paths.folders.css + 'main.css')
            .pipe(minifyCSS())
            .pipe(gulp.dest(paths.folders.css));
});

gulp.task('scss-lint', function () {
    return gulp.src(paths.files.scss)
            .pipe(scsslint());
});


/* Watch */
gulp.task('watch:html', function () {
    gulp.watch([paths.files.html], ['html-check']);
});

gulp.task('watch:css', function () {
    gulp.watch([paths.files.scss], ['scss-lint']);
    gulp.watch([paths.files.scss, paths.files.css], ['css-concat']);
});