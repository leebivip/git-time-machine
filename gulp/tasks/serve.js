var gulp       = require('gulp');
var nodemon    = require('gulp-nodemon');

gulp.task('serve', function () {
  nodemon({ script: 'server.js', ignore: ['src', 'build'], nodeArgs: ['--debug'] })
});
