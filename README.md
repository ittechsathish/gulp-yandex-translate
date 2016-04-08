# gulp-yandex-translate

Translate English JSON file to other language json file .


## Usage
  var gulp = require('gulp')
  var translate = require('gulp-yandex-translate');

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
  
    prefix: integer, defining how many parts of the path (separated by /) should be ignored as they are prefixes
