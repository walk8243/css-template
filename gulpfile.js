var gulp  = require('gulp'),
    sass  = require('gulp-sass'),
    cssmin  = require('gulp-cssmin'),
    rename  = require('gulp-rename'),
    autoprefixer  = require('gulp-autoprefixer'),
    frontnote = require('gulp-frontnote');

// タスクの定義
gulp.task('sass', function() {
  gulp.src('./sass/*.scss')
    .pipe(frontnote({
      css       : '../css/style.min.css',
      overview  : './README.md'
    }))
    .pipe(
      sass({
        outputStyle: 'expanded'
      }).on('error', sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(gulp.dest('./css'))
    .pipe(cssmin())
    .pipe(rename({
      extname: 'min.css'
    }))
    .pipe(gulp.dest('./css'));
});

// デフォルトでの起動時の設定
gulp.task('default', ['sass']);

gulp.task('watch', ['default'], function() {
  gulp.watch('./sass/**/*.scss', ['sass']);
});
