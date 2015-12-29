var gulp   = require('gulp'),
    jshint = require('gulp-jshint');

// Define the default task and add the watch task to it
gulp.task('default', ['jshint','watch']);

// Configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('lib/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
});

// Configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('lib/**/*.js', ['jshint']);
});
