const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const inky = require('inky');
const rimraf = require('rimraf');
const inlineCss = require('gulp-inline-css');

//Deletes current dist folder to make way for our new inky modded file
gulp.task('deleteDist', (done) => {
    rimraf('dist', done);
});

//inky conversion
gulp.task('inky', () => {
    return gulp.src('index.html')
    .pipe(inky())
    .pipe(inlineCss())
    .pipe(gulp.dest('dist'));
});

//for instant reload on save
gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
    })
});

//for sassers
gulp.task('sass', () => {
    return gulp.src('./scss/**/*.scss') //source
        .pipe(sass()) //what we do with the file
        .pipe(gulp.dest('./css')) //destination
        .pipe(browserSync.reload({
            stream: true
        }))
});

//watch task
/* 
What this does is carries out the tasks that we have labelled above in order from left to right.
At first the watcher sees if we've made any changes to our sass, if we have we convert this to css
then it watches our index.html file for changes. If there is changes, we want to start the inky task again
in order to convert the new changes.

The browser sync is delayed with a timeout function due to it firing before inky could produce it's changes.
*/
gulp.task('watch', ['deleteDist', 'inky', 'browserSync', 'sass'], () => {
    gulp.watch('./scss/**/*.scss', ['sass']);
    //Other Watchers
    gulp.watch('./index.html', () =>{
        gulp.start('deleteDist');
        gulp.start('inky');
        setTimeout(function(){
            browserSync.reload();
        }, 500);
    });
});