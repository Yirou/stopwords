const fs = require('fs');
const stopWordFilesDirectory = __dirname + '/../resources/';
const read = require('fs-readdir-recursive');


module.exports = function (langs/*array of lang*/) {
    return {
        getStopWords: function (optLangs/*optional array of langs*/) {
            let result = {};
            try {
                let files = readDir(optLangs || langs);
                files.forEach(file => {
                    if (file.endsWith('.json')) {
                        let filename = file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.'));
                        result[filename] = JSON.parse(fs.readFileSync(stopWordFilesDirectory + file));
                    }
                });
                return result;
            } catch (e) {
                return result;
            }

        },
        isStopWord: function (value, optLangs/*optional array of langs*/) {
            try {
                let files = readDir(optLangs || langs);
                value = value.toLowerCase();
                for (let i = 0; i < files.length; i++) {
                    if (files[i].endsWith('.json')) {
                        let stopWordFile = JSON.parse(fs.readFileSync(stopWordFilesDirectory + files[i]));
                        if (stopWordFile.values.indexOf(value) >= 0 && stopWordFile.exceptions.indexOf(value) < 0)
                            return {isStopWord: true, file: files[i].substr(files[i].lastIndexOf('/') + 1, files[i].length)};
                    }
                }
                return false;
            } catch (e) {
                return false;
            }
        }

    }
}



var readDir = function (langs = 'all'/*or array of lang*/) {
    let filter;
    if (langs !== 'all')
        filter = function (name, index, dir) {
            return langs.indexOf(name) >= 0 || langs.indexOf(name.split('.')[0]) >= 0;
        };
    return  read(stopWordFilesDirectory, filter);
};
