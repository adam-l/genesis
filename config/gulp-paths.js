export default {
    folders: {
        css:     '../src/stylesheets/css/',
        cssTemp: '../temp/css-testing/'
    },
    files: {
        html:    '../src/templates/**/*.html',
        swig:    ['../src/templates/_swig/**/*.swig', '!../src/templates/_swig/**/_*.swig',],
        scss:    '../src/stylesheets/**/*.scss',        
        css:     '../src/stylesheets/**/*.css',
        js:      '../src/scripts/**/*.js',
        cssTemp: '../temp/css-test/**/*.css'
    }
};