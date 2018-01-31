var gulp = require('gulp');

// copy
gulp.task('copy', function(){
    return gulp.src('src/**/*', {base: 'src'})
        .pipe(gulp.dest('test'))
        .pipe(gulp.dest('demo'));
});

gulp.task('copy:watch', function(done){
    return gulp.watch('src/**/*', gulp.series('copy'));
});

var browserSync = require('browser-sync').create();
gulp.task('browserSync', function(){    
    browserSync.init({
        server: {
            baseDir: 'test'
        }
    });
});

gulp.task('browserSync:watch', function(done){
    gulp.watch('test/**/*', function(done){
        browserSync.reload();
        done();
    });
});

gulp.task('run', gulp.parallel('copy:watch','browserSync','browserSync:watch'));
