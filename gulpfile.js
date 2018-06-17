var gulp  = require('gulp'),
    sass  = require('gulp-sass');

// タスクの定義
gulp.task('sass', function() {
  gulp.src('./sass/**/*.scss')
    .pipe(
      sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError)
    ).pipe(gulp.dest('./css'));
});

// デフォルトでの起動時の設定
gulp.task('default', ['sass']);
