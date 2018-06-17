var gulp  = require('gulp'),
    sass  = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    frontnote = require('gulp-frontnote');

// タスクの定義
gulp.task('sass', function() {
  gulp.src('./sass/**/*.scss')
    .pipe(frontnote({
      css: '../css/style.css'
    }))
    .pipe(
      sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(gulp.dest('./css'));
});

// デフォルトでの起動時の設定
gulp.task('default', ['sass']);
