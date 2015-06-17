var
  gulp       = require('gulp'),
  plumber    = require('gulp-plumber'),
  http       = require('http'),
  rename     = require('gulp-rename'),
  ecstatic   = require('ecstatic');
  watch      = require('gulp-watch'),
  concat     = require('gulp-concat'),
  serverport = 8080,
  coffee     = require('gulp-coffee'),
  uglify     = require('gulp-uglify'),
  sass       = require('gulp-ruby-sass'),
  minifyCSS  = require('gulp-minify-css'),
  rename     = require('gulp-rename'),
  flatten    = require('gulp-flatten'),
  prefix     = require("gulp-autoprefixer"),
  jshint     = require('gulp-jshint'),
  gulpFilter = require('gulp-filter'),
  filter     = gulpFilter('**/*.js', '!**/*.min.js');
  clean      = require('gulp-clean');

var
  browserSync = require('browser-sync'),
  reload      = browserSync.reload;

var onError = function (err) {
  console.log("YO SUCKA!!!!!!!!!!!!!!");
  console.log(err);
  console.log("----------------------");
};

var wrench = {
  inherit: true,
  errorHandler: onError
}

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

gulp.task('browser-sync', function() {
  browserSync({
    proxy: "http://localhost:"+serverport
    // server: { baseDir: "./" }
  });
});

gulp.task('javascript', function() {
  gulp.src(angular_head)
  .pipe(plumber(wrench))
  .pipe(uglify())
  .pipe(concat('ang-head.min.js'))
  .pipe(gulp.dest('./javascripts/'))
  .pipe(plumber.stop())
  .pipe(reload({stream:true}));

  gulp.src(vendor_foot)
  .pipe(plumber(wrench))
  .pipe(uglify())
  .pipe(concat('vendor-foot.min.js'))
  .pipe(gulp.dest('./javascripts/'))
  .pipe(plumber.stop())
  .pipe(reload({stream:true}));

  gulp.src(vendor_head)
  .pipe(plumber(wrench))
  // .pipe(uglify())
  .pipe(concat('vendor-head.min.js'))
  .pipe(gulp.dest('./javascripts/'))
  .pipe(plumber.stop())
  .pipe(reload({stream:true}));

  gulp.src(scripts_foot)
  .pipe(plumber(wrench))
  .pipe(concat('js-foot.coffee'))
  .pipe(coffee())
  // .pipe(uglify())
  .pipe(gulp.dest('./javascripts/'))
  .pipe(plumber.stop())
  .pipe(reload({stream:true}));
});

gulp.task('sass', function() {
  gulp.src('./styles/sass/styles.sass')
  .pipe(sass({'quiet': true, sourcemap: true }))
  // .pipe(prefix("last 1 version", "> 1%"))
  // .pipe(minifyCSS())
  // .pipe(rename('styles.min.css'))
  .pipe(gulp.dest('./styles/'))
  .pipe(reload({stream:true}));
  // ("last 1 version", "> 1%", "ie 8", "ie 7")
});

gulp.task('html', function (){
  gulp.src('./index.html')
  .pipe(gulp.dest('./'))
  .pipe(reload({stream:true}));
});

gulp.task('serve', function () {
  // http.createServer(ecstatic({ root: __dirname + '/public' })).listen(serverport);
  http.createServer(
    ecstatic({ root: __dirname })).listen(serverport);
    // lrserver.listen(livereloadport);
});

gulp.task('watch', function (reload) {
  gulp.watch('./styles/sass/*.sass', ['sass']);
  gulp.watch('./javascripts/**/*.coffee', ['javascript']);
  gulp.watch('./javascripts/plain.js', reload({stream:true}));
  // gulp.watch('public/sass/**/*.scss', ['sass']);
  gulp.watch('./index.html', ['html']);
  // gulp.watch('public/img/svg-dirty/*.svg', ['SVG']);
});


gulp.task('default', ['sass', 'javascript', 'browser-sync', 'serve', 'html']);
