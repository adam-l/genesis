import gulp        from 'gulp';
import eventStream from 'event-stream';

import remove      from 'gulp-rimraf';
import concat      from 'gulp-concat';

import nameLint    from require('name-lint');

import htmlHint    from 'gulp-htmlhint';
import htmlW3C     from 'gulp-w3cjs';
import htmlWCAG    from 'gulp-accessibility';

import sass        from 'gulp-sass';
import scsslint    from 'gulp-scss-lint';
import minifyCSS   from 'gulp-minify-css';

var paths = {
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

gulp.task('test:html', ['html-hint', 'html-w3c', 'html-wcag']);


/* Stylesheets */
gulp.task('css-clean', () => {
    return gulp.src(paths.folders.css + 'main.css')
            .pipe(remove());
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

gulp.task('scss-lint', () => {
    return gulp.src(paths.files.scss)
            .pipe(scsslint());
});


/* Watch */
gulp.task('watch:html', () => {
    gulp.watch([paths.files.html], ['html-check']);
});

gulp.task('watch:css', () => {
    gulp.watch([paths.files.scss], ['scss-lint']);
    gulp.watch([paths.files.scss, paths.files.css], ['css-concat']);
});