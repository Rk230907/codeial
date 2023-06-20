const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify-es').default;


gulp.task('css', async function() {
    console.log('minifying css...');
    await import('gulp-rev')
        .then((rev) => {
            gulp.src('./assets/css/**/*.css')
                .pipe(cssnano())
                .pipe(gulp.dest('./assets.css'));

            return gulp.src('./assets/**/*.css')
                .pipe(rev.default())
                .pipe(gulp.dest('./public/assets'))
                .pipe(rev.default.manifest({
                    cwd: 'public',
                    merge: true
                }))
                .pipe(gulp.dest('./public/assets'));
        })
        .catch((err) => {
            console.error('Error importing gulp-rev:', err);
        });
});


gulp.task('js', async function() {
    console.log('minifying js...');
    await import('gulp-rev')
        .then((rev) => {
            gulp.src('./assets/**/*.js')
                .pipe(rev.default())
                .pipe(gulp.dest('./public/assets'))
                .pipe(rev.default.manifest({
                    cwd: 'public',
                    merge: true
                }))
                .pipe(gulp.dest('./public/assets'));
        })
        .catch((err) => {
            console.error('Error importing gulp-rev:', err);
        });
});

gulp.task('images', async function() {
    console.log('images...');
    await import('gulp-rev')
        .then((rev) => {
            gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
                .pipe(rev.default())
                .pipe(gulp.dest('./public/assets'))
                .pipe(rev.default.manifest({
                    cwd: 'public',
                    merge: true
                }))
                .pipe(gulp.dest('./public/assets'));
        })
        .catch((err) => {
            console.error('Error importing gulp-rev:', err);
        });
});

// gulp.task('clean:assets', function(done){
//     del.sync('./public/assets');
//     done();
// });

// gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){
//     console.log('Building assets');
//     done();
// });

