var gulp = require('gulp');

// copy
gulp.task('copy', function(done){
    gulp.src('source/**/*.js',{base: 'source'})
        .pipe(gulp.dest('test/js'))
        .pipe(gulp.dest('demo/js'));

    gulp.src('source/**/*.css',{base: 'source'})
        .pipe(gulp.dest('test/css'))
        .pipe(gulp.dest('demo/css'));
        
    return done();
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
