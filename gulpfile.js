var gulp = require('gulp')
var translate = require('./index.js');
;

gulp.task('default', function(done) {

    gulp.src(['./en.json'])
        .pipe(translate({
            to: ['sq', 'ar'],
            yandexAPIKey: 'trnsl.1.1.20160407T094237Z.6e30140fe507aeac.411714d6e04854a1e81937290d0e6f54bf62cc0d'
        }))
        .pipe(gulp.dest('./translated'));
        
});
