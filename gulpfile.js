var gulp   = require('gulp'),
    jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint');

// Define the default task and add the watch task to it
gulp.task('default', ['jshint', 'jscs', 'watch']);

// Configure the jshint task
gulp.task('jshint', function() {
  return gulp.src(['lib/**/*.js', 'test/**/*.js', '!test/fixtures/**/*'])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
});

// Configure JSCS task
gulp.task('jscs', () => {
    return gulp.src(['lib/**/*.js', 'test/**/*.js', '!test/fixtures/**/*'])
        .pipe(jscs())
        .pipe(jscs.reporter());
});

// Configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch(['lib/**/*.js', 'test/**/*.js', '!test/fixtures/**/*'], ['jshint', 'jscs']);
});
