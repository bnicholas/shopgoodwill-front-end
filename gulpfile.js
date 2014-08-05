var
    gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    coffee     = require('gulp-coffee'),
    uglify     = require('gulp-uglify'),
    // sass       = require('gulp-sass'),
    sass       = require('gulp-ruby-sass'),
    minifyCSS  = require('gulp-minify-css'),
    prefix     = require('gulp-autoprefixer'),
    jshint     = require('gulp-jshint'),
    gulpFilter = require('gulp-filter'),
    flatten    = require('gulp-flatten'),
    clean      = require('gulp-clean'),
    rename     = require('gulp-rename'),
    filter     = gulpFilter('**/*.js', '!**/*.min.js');


var angular_head = [    
  './bower_components/jquery/jquery.js'
  ,'./bower_components/get-style-property/get-style-property.js'
  ,'./bower_components/angular/angular.js'
  ,'./bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js'
];

var vendor_head = [
  './bower_components/jquery/jquery.js'
  ,'./bower_components/modernizr/modernizr.js'

];

var vendor_foot = [
  './bower_components/headroom.js/dist/headroom.js'
  ,'./bower_components/eventEmitter/EventEmitter.js'
  ,'./bower_components/eventie/eventie.js'
  ,'./bower_components/imagesloaded/imagesloaded.js'
  ,'./bower_components/underscore/underscore.js'
  ,'./bower_components/bootstrap-sass/js/affix.js'
  ,'./bower_components/bootstrap-sass/js/alert.js'
  ,'./bower_components/bootstrap-sass/js/button.js'
  ,'./bower_components/bootstrap-sass/js/carousel.js'
  ,'./bower_components/bootstrap-sass/js/collapse.js'
  ,'./bower_components/bootstrap-sass/js/dropdown.js'
  ,'./bower_components/bootstrap-sass/js/modal.js'
  ,'./bower_components/bootstrap-sass/js/tooltip.js'
  ,'./bower_components/bootstrap-sass/js/popover.js'
  ,'./bower_components/bootstrap-sass/js/scrollspy.js'
  ,'./bower_components/bootstrap-sass/js/tab.js'
  ,'./bower_components/bootstrap-sass/js/transition.js'
];

var scripts_foot = [
  './javascripts/vanilla/coffee/global.coffee'
  ,'./javascripts/vanilla/coffee/app.coffee'
  ,'./javascripts/vanilla/coffee/storage.coffee'
  ,'./javascripts/vanilla/coffee/products.coffee'
  ,'./javascripts/vanilla/coffee/search.coffee'
  ,'./javascripts/vanilla/coffee/favorites.coffee'
];

gulp.task('javascript', function() {
  gulp.src(angular_head)
  .pipe(uglify())
  .pipe(concat('ang-head.min.js'))
  .pipe(gulp.dest('./javascripts/'));
  
  gulp.src(vendor_foot)
  .pipe(uglify())
  .pipe(concat('vendor-foot.min.js'))
  .pipe(gulp.dest('./javascripts/'));
  
  gulp.src(vendor_head)
  // .pipe(uglify())
  .pipe(concat('vendor-head.min.js'))
  .pipe(gulp.dest('./javascripts/'));
  
  gulp.src(scripts_foot)
  .pipe(concat('js-foot.coffee'))
  .pipe(coffee())
  // .pipe(uglify())
  .pipe(gulp.dest('./javascripts/'));
});

gulp.task('sass', function() {
  console.log('sass');
  gulp.src('./styles/sass/styles.sass')
  .pipe(sass({'quiet': true }))
  // .pipe(prefix("last 1 version", "> 1%"))
  // .pipe(minifyCSS())
  // .pipe(rename('styles.min.css'))
  .pipe(gulp.dest('./styles/'));
  // ("last 1 version", "> 1%", "ie 8", "ie 7")
});

gulp.watch('./styles/sass/*.sass', ['sass']);
// gulp.watch('./javascripts/*/*.js', ['javascript']);
gulp.watch('./javascripts/**/*.coffee', ['javascript']);
// gulp.watch('./javascripts/plain.js', ['vendorjs']);

gulp.task('default', ['sass', 'javascript']);