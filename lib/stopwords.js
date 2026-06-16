'use strict';

const fs = require('fs');
const path = require('path');

const RESOURCES_DIR = path.join(__dirname, '..', 'resources');
const DEFAULT_ENCODING = 'utf8';
const DEFAULT_SEPARATOR = '\n';

class StopWords {
  #stopwords;
  #userWords;
  #exceptions;

  constructor() {
    this.#stopwords = this.#loadLanguages();
    this.#userWords = new Set();
    this.#exceptions = new Set();
  }

  get availableLanguages() {
    return this.#stopwords.map(s => s.lang);
  }

  getStopWords(langs) {
    if (langs === undefined) {
      return this.#stopwords.map(({ lang, words }) => ({ lang, data: [...words] }));
    }
    const languages = Array.isArray(langs) ? langs : [langs];
    if (!languages.length) return [];
    return this.#stopwords
      .filter(s => languages.includes(s.lang))
      .map(({ lang, words }) => ({ lang, data: [...words] }));
  }

  isStopWord(word) {
    const value = String(word).toLowerCase();
    if (this.#exceptions.has(value)) return false;
    if (this.#userWords.has(value)) return true;
    return this.#stopwords.some(s => s.words.has(value));
  }

  add(items) {
    for (const word of this.#resolveWords(items)) {
      this.#userWords.add(word.toLowerCase());
    }
  }

  remove(items) {
    for (const word of this.#resolveWords(items)) {
      this.#exceptions.add(word.toLowerCase());
    }
  }

  cleanText(str = '', separator = ' ') {
    return String(str)
      .split(separator)
      .filter(word => !this.isStopWord(word))
      .join(separator);
  }

  reset() {
    this.#userWords.clear();
    this.#exceptions.clear();
  }

  #resolveWords(items) {
    const entries = Array.isArray(items) ? items : [items];
    const words = [];
    for (const entry of entries) {
      const { data, encoding, separator } = this.#parseEntry(entry);
      if (typeof data === 'string' && fs.existsSync(data)) {
        words.push(...fs.readFileSync(data, encoding).split(separator));
      } else if (Array.isArray(data)) {
        words.push(...data);
      } else {
        words.push(String(data));
      }
    }
    return words.filter(w => w && w.trim().length > 0);
  }

  #parseEntry(entry) {
    if (entry !== null && typeof entry === 'object' && !Array.isArray(entry)) {
      return {
        data: entry.file,
        encoding: entry.encoding ?? DEFAULT_ENCODING,
        separator: entry.separator ?? DEFAULT_SEPARATOR,
      };
    }
    return { data: entry, encoding: DEFAULT_ENCODING, separator: DEFAULT_SEPARATOR };
  }

  #loadLanguages() {
    return fs.readdirSync(RESOURCES_DIR, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => {
        const lang = entry.name;
        const words = fs
          .readFileSync(path.join(RESOURCES_DIR, lang, lang), DEFAULT_ENCODING)
          .split(DEFAULT_SEPARATOR)
          .filter(Boolean);
        return { lang, words: new Set(words) };
      });
  }
}

module.exports = new StopWords();
module.exports.StopWords = StopWords;
