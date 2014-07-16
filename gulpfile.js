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


var angular_head = [    
  './bower_components/jquery/jquery.js'
  ,'./bower_components/get-style-property/get-style-property.js'
  ,'./bower_components/angular/angular.js'
];
var angular_foot = [
  './bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js'
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
  ,'./bower_components/headroom.js/dist/headroom.js'
  ,'./bower_components/salvattore/src/salvattore.js'
  // ,'./bower_components/eventEmitter/EventEmitter.js'
  // ,'./bower_components/eventie/eventie.js'
  // ,'./bower_components/doc-ready/doc-ready.js'
  //,'./bower_components/angular-resource/angular-resource.js'
  // ,'./bower_components/angular-deckgrid/angular-deckgrid.js'
  // ,'./bower_components/angular-masonry/angular-masonry.js'
];
var vanilla_head = [
  './bower_components/jquery/jquery.js'
  ,'./bower_components/modernizr/modernizr.js'

];
var vanilla_foot = [
  './bower_components/headroom.js/dist/headroom.js'
  ,'./bower_components/eventEmitter/EventEmitter.js'
  ,'./bower_components/eventie/eventie.js'
  ,'./bower_components/imagesloaded/imagesloaded.js'
  ,'./bower_components/underscore/underscore.js'
  // './bower_components/doc-ready/doc-ready.js',
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
  // ,'javascripts/plain.js'
  
  // './bower_components/salvattore/src/salvattore.js'
  
];
var modernizr_features = [
  
];

gulp.task('vendorjs', function() {
  gulp.src(angular_head)
  .pipe(uglify())
  .pipe(concat('ang-head.min.js'))
  .pipe(gulp.dest('./javascripts/'));
  
  gulp.src(angular_foot)
  .pipe(uglify())
  .pipe(concat('ang-foot.min.js'))
  .pipe(gulp.dest('./javascripts/'));
  
  gulp.src(vanilla_head)
  // .pipe(uglify())
  .pipe(concat('js-head.min.js'))
  .pipe(gulp.dest('./javascripts/'));
  
  gulp.src(vanilla_foot)
  // .pipe(uglify())
  .pipe(concat('js-foot.min.js'))
  .pipe(gulp.dest('./javascripts/'));
});

gulp.task('javascript', function() {
  gulp.src('./javascripts/client/*.js')
  .pipe(jshint.reporter('default'))
  // .pipe(uglify())
  .pipe(concat('client.js'))
  // .pipe(rename('client.min.js'))
  .pipe(gulp.dest('./javascripts/'));
  now = new Date();
  console.log("javascript built at: "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds());
});

gulp.task('sass', function() {
  gulp.src('./styles/sass/*.sass')
  .pipe(sass({'quiet': true }))
  .pipe(prefix("last 1 version", "> 1%"))
  .pipe(minifyCSS())
  .pipe(rename('styles.min.css'))
  .pipe(gulp.dest('./styles/'));
  // ("last 1 version", "> 1%", "ie 8", "ie 7")
});

gulp.watch('./styles/sass/*.sass', ['sass']);
gulp.watch('./javascripts/client/*.js', ['javascript']);
// gulp.watch('./javascripts/plain.js', ['vendorjs']);

gulp.task('default', ['sass', 'javascript', 'vendorjs']);