var fs = require('fs');
var stopWordFilesDirectory = __dirname + '/../resources/';
var read = require('fs-readdir-recursive');
var files = read(stopWordFilesDirectory);


var isStopWord = function (value) {
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

var getStopWords = function (lang/*or all*/) {

}
exports.isStopWord = isStopWord;