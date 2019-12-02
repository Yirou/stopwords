const fs = require('fs');
const stopWordFilesDirectory = __dirname + '/../resources/';
const read = require('fs-readdir-recursive');
const defaultEncoding = 'utf8';
const defaultSeparator = '\n';

module.exports = function (langs/*array of lang*/) {
    let self = this;
    self._files = readDir(langs);
    self._userWords = [];
    self._exceptions = [];
    self._stopwords = [];

    for (let file of self._files) {
        self._stopwords.push({
            data: fs.readFileSync(stopWordFilesDirectory + file, defaultEncoding).split(defaultSeparator),
            lang: file.substr(file.lastIndexOf('/') + 1, file.length)
        });
    }

    return {
        getStopWords: function () {
            let result = {};
            self._files.forEach(file => {
                let filename = file.substring(file.lastIndexOf('/') + 1, file.length);
                result[filename] = fs.readFileSync(stopWordFilesDirectory + file, defaultEncoding).split(defaultSeparator);
            });
            if (self._userWords.length)
                result['userWords'] = self._userWords;
            return result;
        },
        isStopWord: function (value) {
            value = typeof value === 'string' ? value : String(value);
            value = value.toLowerCase();

            if (self._userWords.includes(value))
                return {isStopWord: true, origin: 'userWords'};

            for (let stopwords of self._stopwords) {
                if (!self._exceptions.includes(value) && stopwords.data.includes(value))
                    return {isStopWord: true, origin: stopwords.lang};
            }

            return false;
        },
        add: function (stopwords/*array of csv files or just data*/) {
            stopwords = Array.isArray(stopwords) ? stopwords : [stopwords];
            for (let entry of stopwords) {
                let data = typeof entry === 'object' && entry.file ? entry.file : entry;
                let encoding = typeof entry === 'object' && entry.encoding ? entry.encoding : defaultEncoding;
                let separator = typeof entry === 'object' && entry.separator ? entry.separator : defaultSeparator;
                if (fs.existsSync(data)) {
                    let words = fs.readFileSync(data, encoding).split(separator);
                    self._userWords = self._userWords.concat(words);
                } else
                    self._userWords.push(data);
            }
        },
        remove: function (stopwords/*array of json files or json data*/) {
            stopwords = Array.isArray(stopwords) ? stopwords : [stopwords];
            for (let entry of stopwords) {
                let data = typeof entry === 'object' && entry.file ? entry.file : entry;
                let encoding = typeof entry === 'object' && entry.encoding ? entry.encoding : defaultEncoding;
                let separator = typeof entry === 'object' && entry.separator ? entry.separator : defaultSeparator;
                if (fs.existsSync(data)) {
                    let words = fs.readFileSync(data, encoding).split(separator);
                    self._exceptions = self._exceptions.concat(words);
                } else
                    self._exceptions.push(data);

            }
        }
    }
}



var readDir = function (langs = '*'/*or array of lang*/) {
    let filter;
    if (langs !== '*')
        filter = function (name, index, dir) {
            return langs.includes(name) || langs.includes(name.split('.')[0]);
        };
    return  read(stopWordFilesDirectory, filter);
};
