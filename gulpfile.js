var
    gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    coffee     = require('gulp-coffee'),
    uglify     = require('gulp-uglify'),
    sass       = require('gulp-ruby-sass'),
    minifyCSS  = require('gulp-minify-css'),
    prefix     = require('gulp-autoprefixer'),
    jshint     = require('gulp-jshint'),
    gulpFilter = require('gulp-filter'),
    flatten    = require('gulp-flatten'),
    clean      = require('gulp-clean'),
    rename     = require('gulp-rename'),
    filter     = gulpFilter('**/*.js', '!**/*.min.js');


var bower_components = [    
  './bower_components/jquery/jquery.js',
  './bower_components/jquery-bridget/jquery.bridget.js',
  './bower_components/get-style-property/get-style-property.js',
  './bower_components/get-size/get-size.js',
  './bower_components/eventEmitter/EventEmitter.js',
  './bower_components/eventie/eventie.js',
  './bower_components/doc-ready/doc-ready.js',
  './bower_components/matches-selector/matches-selector.js',
  './bower_components/outlayer/item.js',
  './bower_components/outlayer/outlayer.js',
  './bower_components/masonry/masonry.js',
  './bower_components/imagesloaded/imagesloaded.js',
  './bower_components/angular/angular.js',
  './bower_components/angular-masonry/angular-masonry.js',
  './bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
  './bower_components/bootstrap-sass/dist/js/bootstrap.js'
];

gulp.task('vendorjs', function() {
  gulp.src(bower_components)
  .pipe(uglify())
  .pipe(concat('vendor.min.js'))
  .pipe(gulp.dest('./javascripts/'));
});

gulp.task('javascript', function() {
  gulp.src('./javascripts/client.js')
  .pipe(jshint.reporter('default'))
  .pipe(uglify())
  .pipe(rename('client.min.js'))
  .pipe(gulp.dest('./javascripts/'));
});

gulp.task('sass', function() {
  gulp.src('./styles/sass/*.sass')
  .pipe(sass({'quiet': true }))
  .pipe(prefix("last 1 version"))
  .pipe(minifyCSS())
  .pipe(rename('styles.min.css'))
  .pipe(gulp.dest('./styles/'));
  // ("last 1 version", "> 1%", "ie 8", "ie 7")
});

gulp.watch('./styles/sass/*.sass', ['sass']);
gulp.watch('./javascripts/client.js', ['javascript']);

gulp.task('default', ['sass', 'javascript', 'vendorjs']);