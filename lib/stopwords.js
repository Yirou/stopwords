const fs = require('fs');
const stopWordFilesDirectory = __dirname + '/../resources/';
const read = require('fs-readdir-recursive');
const defaultEncoding = 'utf8';


module.exports = function (langs/*array of lang*/) {
    let files = readDir(langs);
    let userWords = [];
    let exceptions = [];

    return {
        getStopWords: function () {
            let result = {};
            try {
                files.forEach(file => {
                    let filename = file.substring(file.lastIndexOf('/') + 1, file.length);
                    result[filename] = fs.readFileSync(stopWordFilesDirectory + file, defaultEncoding).split('\n');
                });
            } catch (e) {
            }
            if (userWords.length)
                result['userWords'] = userWords;
            return result;
        },
        isStopWord: function (value) {
            try {
                value = value.toLowerCase();
                for (let i = 0; i < files.length; i++) {
                    let stopWords = fs.readFileSync(stopWordFilesDirectory + files[i], defaultEncoding).split('\n');
                    if (!exceptions.includes(value) && stopWords.includes(value))
                        return {isStopWord: true, file: files[i].substr(files[i].lastIndexOf('/') + 1, files[i].length)};
                }
                if (userWords.includes(value))
                    return {isStopWord: true, file: 'userWords'};
            } catch (e) {
            }
            return false;
        },
        include: function (datas/*array of csv files or just data*/) {
            try {
                datas = Array.isArray(datas) ? datas : [datas];
                for (let entry of datas) {
                    let data = typeof entry === 'object' && entry.file ? entry.file : entry;
                    let encoding = typeof entry === 'object' && entry.encoding ? entry.encoding : defaultEncoding;
                    let separator = typeof entry === 'object' && entry.separator ? entry.separator : '\n';
                    if (fs.existsSync(data)) {
                        let words = fs.readFileSync(data, encoding).split(separator);
                        userWords = userWords.concat(words);
                    } else
                        userWords.push(data);
                }
            } catch (e) {
            }
        },
        exclude: function (datas/*array of json files or json data*/) {
            try {
                datas = Array.isArray(datas) ? datas : [datas];
                for (let entry of datas) {
                    let data = typeof entry === 'object' && entry.file ? entry.file : entry;
                    let encoding = typeof entry === 'object' && entry.encoding ? entry.encoding : defaultEncoding;
                    let separator = typeof entry === 'object' && entry.separator ? entry.separator : '\n';
                    if (fs.existsSync(data)) {
                        let words = fs.readFileSync(data, encoding).split(separator);
                        exceptions = exceptions.concat(words);
                    } else
                        exceptions.push(data);

                }
            } catch (e) {
            }
        }
    }
}



var readDir = function (langs = 'all'/*or array of lang*/) {
    let filter;
    if (langs !== 'all')
        filter = function (name, index, dir) {
            return langs.includes(name) || langs.includes(name.split('.')[0]);
        };
    return  read(stopWordFilesDirectory, filter);
};
