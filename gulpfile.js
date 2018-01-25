var gulp = require('gulp');
var sass = require('gulp-sass');
var minifycss = require('gulp-clean-css');
var header = require('gulp-header');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var gulpif = require('gulp-if');
var concatCss = require('gulp-concat-css');

var version = "-v0.7";

var sass_src = [
    'lib/sass/build-calcite-maps-bootstrap.scss',
    'lib/sass/build-calcite-maps.scss',
	'lib/sass/layouts/**/*.scss',
	'lib/sass/support/**/*.scss'
];

var copy_rename_src = [
    {src: 'lib/js/dojo/*.js', dest: 'dist/js/dojo'},
    {src: 'lib/js/jquery/*.js', dest: 'dist/js/jquery'}
];

var copy_src = [
    {src: 'node_modules/bootstrap-sass/assets/fonts/bootstrap/**/*', dest: 'dist/fonts/bootstrap'},
    {src: 'lib/fonts/calcite/**/*', dest: 'dist/fonts/calcite'},
    {src: 'lib/fonts/avenir-next/**/*', dest: 'dist/fonts/avenir-next'},
    {src: 'lib/js/dojo-bootstrap/**/*', dest: 'dist/vendor/dojo-bootstrap'}
];

var minifycss_src = [
    {dest: 'dist/css/calcite-maps.min-v0.7.css' , src: ['dist/css/calcite-maps-v0.7.css']},
    {dest: 'dist/css/calcite-maps-bootstrap.min-v0.7.css' , src: ['dist/css/calcite-maps-bootstrap-v0.7.css']},
    {dest: 'dist/css/calcite-maps-arcgis-3.x.min-v0.7.css' , src: ['dist/css/calcite-maps-v0.7.css', 'dist/css/layouts/inline-zoom-v0.7.css', 'dist/css/layouts/large-title-v0.7.css', 'dist/css/layouts/small-title-v0.7.css', 'dist/css/support/arcgis-3.x-v0.7.css']},
    {dest: 'dist/css/calcite-maps-arcgis-4.x.min-v0.7.css' , src: ['dist/css/calcite-maps-v0.7.css', 'dist/css/layouts/inline-zoom-v0.7.css', 'dist/css/layouts/large-title-v0.7.css', 'dist/css/layouts/small-title-v0.7.css','dist/css/support/arcgis-4.x-v0.7.css']},
    {dest: 'dist/css/calcite-maps-esri-leaflet.min-v0.7.css' , src: ['dist/css/calcite-maps-v0.7.css', 'dist/css/layouts/inline-zoom-v0.7.css', 'dist/css/layouts/large-title-v0.7.css', 'dist/css/layouts/small-title-v0.7.css', 'dist/css/support/esri-leaflet-v0.7.css']}
];

// Javascript banner
// var banner = '/* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
// 				'*  <%= pkg.homepage %>\n' +
// 				'*  Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
//                 '*  Apache 2.0 License */\n';
                
var pkg = require('./package.json');
var banner = ['/*',
    ' * <%= pkg.name %> - v<%= pkg.version %> - <%= thedate %>',
    ' * <%= pkg.homepage %>',
    ' * Copyright (c) <%= theyear %> Environmental Systems Research Institute, Inc.',
    ' * Apache 2.0 License',
    ' */',
    ''].join('\n');

gulp.task('sass', function () {
    return gulp.src(sass_src, {base: './lib/sass'})
        .pipe(sass({includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets']}))
        .pipe(rename(function (path) {
          path.basename = path.basename.replace('build-', '') + version;
        }))
        .pipe(gulp.dest('dist/css'));
      
});

// gulp.task('minify-css', ['sass'], function () {
//     return gulp.src('dist/css/*.css')
//         .pipe(minifycss())
//         .pipe(rename(function (path) {
//             path.basename = path.basename.replace(version, ".min" + version)
//           }))
//         .pipe(gulp.dest('dist/css'));
      
// });



gulp.task('minify-css', ['sass'], function () {

    minifycss_src.forEach(function(item) {
        gulp.src(item.src, {base: './dist/css'})
        .pipe(concatCss(item.dest))
        .pipe(minifycss())
        .pipe(gulp.dest('.'))

    })});

gulp.task('copy-and-rename', function () {

    copy_rename_src.forEach(function(copy) {
        gulp.src(copy.src)
        .pipe(rename(function (path) {
            path.basename += version;
          }))
        .pipe(gulp.dest(copy.dest));
    });

});

gulp.task('copy-direct', function () {

    copy_src.forEach(function(copy) {
        gulp.src(copy.src)
        .pipe(gulp.dest(copy.dest));
    });

});

gulp.task('default', ['minify-css', 'copy-and-rename', 'copy-direct']);

