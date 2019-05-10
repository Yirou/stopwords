var fs = require('fs');
var stopWordFilesDirectory = __dirname + '/../resources/';
var read = require('fs-readdir-recursive');



var isStopWord = function (value, lang) {
    var files = readDir(lang);
    try {
        value = value.toLowerCase();
        for (var i = 0; i < files.length; i++) {
            var stopWordFile = JSON.parse(fs.readFileSync(stopWordFilesDirectory + files[i]));
            if (stopWordFile.values.indexOf(value) >= 0 && stopWordFile.exceptions.indexOf(value) < 0)
                return {isStopWord: true, file: files[i].substr(files[i].lastIndexOf('/') + 1, files[i].length)};
        }
        return false;
    } catch (e) {
        return false;
    }
};

exports.getStopWords = function (lang/*or all*/) {
    var result = {};
    try {
        var files = readDir(lang);
        files.forEach(file => {
            var filename = file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.'));
            result[filename] = JSON.parse(fs.readFileSync(stopWordFilesDirectory + file));
        });
        return result;
    } catch (e) {
        return result;
    }

};

var readDir = function (lang = 'all') {
    var filter;
    if (lang !== 'all') {
        var filter = function (name, index, dir) {
            return name.startsWith(lang);
        };
    }
    return  read(stopWordFilesDirectory, filter);
};

exports.isStopWord = isStopWord;