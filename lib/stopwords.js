const fs = require('fs');
const stopWordFilesDirectory = __dirname + '/../resources/';
const read = require('fs-readdir-recursive');
const defaultEncoding = 'utf8';
const defaultSeparator = '\n';

class StopWords {
    constructor() {
        this.files = this.#readDir();
        this.userWords = [];
        this.exceptions = [];
        this.stopwords = this.files.map(file => {
            return {
                data: fs.readFileSync(stopWordFilesDirectory + file, defaultEncoding).split(defaultSeparator),
                lang: file.substring(file.lastIndexOf('/') + 1)
            }
        })

    }

    /**
     *
     * @param langs
     * @returns {*[]|*}
     */
    getStopWords(langs = []) {
        if (!langs?.length)
            return [];

        const languages = Array.isArray(langs) ? langs : [langs]
        return this.stopwords.filter(stopwords => languages.includes(stopwords.lang));
    };

    /**
     *
     * @param word
     * @returns {{isStopWord: boolean, origin: *}|{isStopWord: boolean, origin: string}|null}
     */
    isStopWord(word) {
        const value = (typeof word === 'string' ? word : String(word)).toLowerCase();

        if (this.exceptions.includes(value)) {
            return false;
        }
        if (this.userWords.includes(value)) {
            return true;
        }
        return this.stopwords.some(stopwordSet => stopwordSet.data.includes(value));
    }

    /**
     *
     * @param items
     */
    add(items) {
        const stopwords = Array.isArray(items) ? items : [items];
        for (const entry of stopwords) {
            let wordsToAdd = []
            const {data, encoding, separator} = this.#getEntryProperties(entry);
            if (fs.existsSync(data)) {
                wordsToAdd = fs.readFileSync(data, encoding).split(separator);
            } else {
                wordsToAdd = Array.isArray(data) ? data : [data];
            }
            this.userWords.push(...wordsToAdd);
        }
    };

    #getEntryProperties(entry) {
        const isObject = typeof entry === 'object' && entry !== null;
        const {file, encoding, separator} = isObject ? entry : {};

        return {
            data: file ?? entry,
            encoding: encoding ?? defaultEncoding,
            separator: separator ?? defaultSeparator
        };
    }


    /**
     *
     * @param items
     */
    remove(items) {
        const stopwords = Array.isArray(items) ? items : [items];
        for (const entry of stopwords) {
            const {data, encoding, separator} = this.#getEntryProperties(entry);
            let wordsToRemove = []
            if (fs.existsSync(data)) {
                wordsToRemove = fs.readFileSync(data, encoding).split(separator);
            } else {
                wordsToRemove = Array.isArray(data) ? data : [data];
            }
            this.exceptions.push(...wordsToRemove);
        }
    };

    /**
     *
     * @param str
     * @param separator
     * @returns {string}
     */
    cleanText(str = '', separator = ' ') {
        const text = typeof str === 'string' ? str : String(str);
        const words = text.split(separator);
        return words.filter(word => !this.isStopWord(word)).join(separator);
    }


    /**
     *
     * @param langs
     * @returns {*}
     */
    #readDir(langs = '*') {
        let filter;
        if (langs !== '*')
            filter = function (name, index, dir) {
                return langs.includes(name) || langs.includes(name.split('.')[0]);
            };
        return read(stopWordFilesDirectory, filter);
    };

}

module.exports = new StopWords();



