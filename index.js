var through = require('through2');
var PluginError = require('plugin-error');
var colors = require('ansi-colors');
var log = require('fancy-log');
var Vinyl = require('vinyl');

var fs = require('fs');
var $q = require('q');
var jsonic = require('jsonic');
var _ = require('lodash');
var translateModule = require('yandex-translate');
var translate = null;

module.exports = function(options) {

    var module_scope = this;
    module_scope.options = options;

    var transform = function(file, enc, callback) {

        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        var options = module_scope.options || {};

        var targetLanguages = [];

        if (!options.to) {
            this.emit('error', new PluginError('gulp-yandex-translate', 'Target language is required'));
        }
        else {

            targetLanguages = _.isString(options.to) ? [options.to] : options.to;

            if (_.some(targetLanguages, function(val) {
                return !_.isString(val);
            })) {
                this.emit('error', new PluginError('gulp-yandex-translate', 'Target language specified in type of string or array of string'));
            }
        }



        if (!options.yandexAPIKey) {
            this.emit('error', new PluginError('gulp-yandex-translate', 'Yandex API Key is Missing'));
        }
        else {

            translate = translateModule(options.yandexAPIKey);
        }

        //parse the json file
        var inputFileContent = jsonic(file.contents.toString());

        var self = this;

        var getTranslateArray = function(jsonInput) {
            //called with every property and it's value

            var jsonRef = [], newFileContent = null;

            function process(key, value, obj) {
                if (typeof value === "string") {

                    jsonRef.push({
                        key: key,
                        value: value,
                        ref: obj
                    });

                }
            }

            function traverse(o, func) {
                for (var i in o) {

                    func.apply(this, [i, o[i], o]);

                    if (o[i] !== null && typeof (o[i]) == "object") {
                        traverse(o[i], func);
                    }
                }
            };

            traverse(jsonInput, process);

            return jsonRef;
        }

        var translateFile = function(language, module_ref) {

            log('', '', colors.magenta('started translating - ' + language));

            var language_defer = $q.defer();

            var allTranslatePromise = [];

            var outputFile = JSON.parse(JSON.stringify(inputFileContent)), jsonRefCloned = getTranslateArray(outputFile), totalLength = _.isArray(jsonRefCloned) ? jsonRefCloned.length : 0;

            if (totalLength == 0) {
                defer.resolve();
            }

            var startingTranslatingLength = 0;

            jsonRefCloned.forEach(function(val, index) {

                var defer = $q.defer();

                translate.translate(val.value, { to: language }, function(err, res) {
                    if (res && res.text[0]) {
                        val.ref[val.key] = res.text[0];
                    }

                    startingTranslatingLength++;

                    defer.resolve();

                    if (err) {
                        defer.reject();
                    }

                    var statusCount = ((startingTranslatingLength / totalLength) * 100) + '%';

                    log('', '', colors.magenta(language) + ' :  ' + colors.green(statusCount));

                });

                allTranslatePromise.push(defer.promise);

            });

            $q.all(allTranslatePromise).then(function() {

                var newFileContent = JSON.stringify(outputFile, null, '\t');

                module_ref.push(new Vinyl({
                    cwd: "./",
                    path: language + ".json",
                    contents: new Buffer(newFileContent)
                }));

                language_defer.resolve();
            }, function() {
                language_defer.reject();
            });

            return language_defer.promise;
        };

        var language_complete_defer = $q.defer(), language_complete_defer_promise = [];

        _.forEach(targetLanguages, function(language) {

            language_complete_defer_promise.push(translateFile(language, self));
        });

        $q.all(language_complete_defer_promise).then(function() {
            language_complete_defer_promise.resolve();

            callback();
        }, function() {
            language_complete_defer_promise.reject();

            callback();
        });
    };

    return through.obj(transform);
}
