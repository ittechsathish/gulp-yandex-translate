# gulp-yandex-translate

Translate English JSON file to other language json file .


## Usage

    var gulp = require('gulp');
    var translate = require('gulp-yandex-translate');
    
    //add a gulp task like below
    gulp.task('default', function(done) {
      //en.json is the input file which should have the english string values
      gulp.src(['./en.json'])
          .pipe(translate({
              to: ['sq', 'ar'], // the destination language names
              yandexAPIKey: 'Yandex API Key'
          }))
          .pipe(gulp.dest('./translated'));
    });
   
      
### Options
  
