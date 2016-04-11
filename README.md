# gulp-yandex-translate

Translate English JSON file to other language json file .

## Usage

1.create a json file which contains english string.

    //en.json
    {
        word : 'search',
        nested: {
            word2: "some words here"
        },
        "word3": {
            nested2: {
                word4: "need to translate"
            }
        }
    }

Note: You can add valid json file or normal javascript json also.

2.Create Yandex API Key in https://tech.yandex.com/keys/get/?service=trnsl

3.Create gulpfile.js

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
   
   
   Language Support: https://tech.yandex.com/translate/doc/dg/concepts/langs-docpage/
      
### Options

    yandexAPIKey : Create a yandex api key - is string type // "yandex_key"
    
    to : string or array of strings to specify the destination language // "ar" or ["ar", "sq"]


