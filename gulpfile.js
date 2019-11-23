var gulp  = require('gulp'),
    sass  = require('gulp-sass'),
    cleanCSS  = require('gulp-clean-css'),
    rename  = require('gulp-rename'),
    autoprefixer  = require('gulp-autoprefixer'),
    frontnote = require('gulp-frontnote');

// タスクの定義
gulp.task('sass', gulp.series(gulpSass));

// デフォルトでの起動時の設定
gulp.task('default', gulp.series('sass'));

gulp.task('watch', gulp.series('default', gulpWatch));


// 処理内容を記述
function gulpSass() {
  return gulp.src('./sass/*.scss')
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
    .pipe(cleanCSS())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./css'));
}
function gulpWatch() {
  gulp.watch('./sass/**/*.scss', gulp.series('sass'));
}
