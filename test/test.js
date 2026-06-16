'use strict';

const assert = require('assert');
const stopwords = require('../lib/stopwords');
const { StopWords } = require('../lib/stopwords');

describe('StopWords Library', function () {

  beforeEach(function () {
    stopwords.reset();
  });

  // ─── availableLanguages ───────────────────────────────────────────────────

  describe('availableLanguages', function () {
    it('should list all loaded languages', function () {
      const langs = stopwords.availableLanguages;
      assert.ok(Array.isArray(langs));
      assert.ok(langs.length > 0);
    });

    it('should include known languages', function () {
      const langs = stopwords.availableLanguages;
      for (const code of ['en', 'fr', 'de', 'es', 'it', 'ar', 'ru', 'zh', 'yo']) {
        assert.ok(langs.includes(code), `Expected language "${code}" to be available`);
      }
    });
  });

  // ─── isStopWord ──────────────────────────────────────────────────────────

  describe('isStopWord', function () {
    it('should return false when word is not a stopword', function () {
      assert.strictEqual(stopwords.isStopWord('programming'), false);
      assert.strictEqual(stopwords.isStopWord('laptop'), false);
    });

    it('should return true when word is a stopword', function () {
      assert.strictEqual(stopwords.isStopWord('the'), true);
      assert.strictEqual(stopwords.isStopWord('et'), true);
    });

    it('should be case insensitive', function () {
      assert.strictEqual(stopwords.isStopWord('the'), true);
      assert.strictEqual(stopwords.isStopWord('THE'), true);
      assert.strictEqual(stopwords.isStopWord('The'), true);
    });

    it('should return false for empty string', function () {
      assert.strictEqual(stopwords.isStopWord(''), false);
    });

    it('should handle non-string input (coerces to string)', function () {
      assert.strictEqual(stopwords.isStopWord(123), false);
      assert.strictEqual(stopwords.isStopWord(null), false);
    });
  });

  // ─── getStopWords ─────────────────────────────────────────────────────────

  describe('getStopWords', function () {
    it('should return all stopwords when called with no argument', function () {
      const result = stopwords.getStopWords();
      assert.ok(Array.isArray(result));
      assert.ok(result.length > 0);
    });

    it('should return an object with lang and data per entry', function () {
      const result = stopwords.getStopWords();
      for (const entry of result) {
        assert.ok(typeof entry.lang === 'string');
        assert.ok(Array.isArray(entry.data));
      }
    });

    it('should return empty array for empty language list', function () {
      const result = stopwords.getStopWords([]);
      assert.ok(Array.isArray(result));
      assert.strictEqual(result.length, 0);
    });

    it('should return stopwords for a single language string', function () {
      const result = stopwords.getStopWords('fr');
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].lang, 'fr');
      assert.ok(Array.isArray(result[0].data));
      assert.ok(result[0].data.length > 0);
    });

    it('should return stopwords for an array of languages', function () {
      const result = stopwords.getStopWords(['fr', 'en']);
      assert.strictEqual(result.length, 2);
      const langs = result.map(r => r.lang);
      assert.ok(langs.includes('fr'));
      assert.ok(langs.includes('en'));
    });

    it('should return empty array for unknown language', function () {
      const result = stopwords.getStopWords('xx');
      assert.strictEqual(result.length, 0);
    });

    it('should return a copy — mutating result does not affect internal state', function () {
      const result = stopwords.getStopWords('en');
      const originalLength = result[0].data.length;
      result[0].data.push('injected');
      const result2 = stopwords.getStopWords('en');
      assert.strictEqual(result2[0].data.length, originalLength);
    });
  });

  // ─── cleanText ───────────────────────────────────────────────────────────

  describe('cleanText', function () {
    it('should remove stopwords from text', function () {
      const result = stopwords.cleanText('et puis voilà');
      assert.strictEqual(result, 'puis');
    });

    it('should handle empty string', function () {
      assert.strictEqual(stopwords.cleanText(''), '');
    });

    it('should handle custom separator', function () {
      const result = stopwords.cleanText('et,puis,voilà', ',');
      assert.strictEqual(result, 'puis');
    });

    it('should preserve non-stopwords', function () {
      const result = stopwords.cleanText('hello world programming');
      assert.strictEqual(result, 'world programming');
    });

    it('should be case insensitive when filtering', function () {
      const result = stopwords.cleanText('Et PUIS voilà');
      assert.strictEqual(result, 'PUIS');
    });

    it('should handle non-string input by coercing', function () {
      assert.strictEqual(stopwords.cleanText(42), '42');
    });
  });

  // ─── add ─────────────────────────────────────────────────────────────────

  describe('add', function () {
    it('should make a single word a stopword', function () {
      stopwords.add('customword');
      assert.strictEqual(stopwords.isStopWord('customword'), true);
    });

    it('should make an array of words into stopwords', function () {
      stopwords.add(['word1', 'word2', 'word3']);
      assert.strictEqual(stopwords.isStopWord('word1'), true);
      assert.strictEqual(stopwords.isStopWord('word2'), true);
      assert.strictEqual(stopwords.isStopWord('word3'), true);
    });

    it('should normalize added words to lowercase', function () {
      stopwords.add('CustomWord');
      assert.strictEqual(stopwords.isStopWord('customword'), true);
      assert.strictEqual(stopwords.isStopWord('CUSTOMWORD'), true);
      assert.strictEqual(stopwords.isStopWord('CustomWord'), true);
    });

    it('should ignore duplicate additions', function () {
      stopwords.add('dup');
      stopwords.add('dup');
      assert.strictEqual(stopwords.isStopWord('dup'), true);
    });
  });

  // ─── remove ──────────────────────────────────────────────────────────────

  describe('remove', function () {
    it('should make a stopword no longer match', function () {
      stopwords.remove('the');
      assert.strictEqual(stopwords.isStopWord('the'), false);
    });

    it('should handle an array of words', function () {
      stopwords.remove(['the', 'and', 'or']);
      assert.strictEqual(stopwords.isStopWord('the'), false);
      assert.strictEqual(stopwords.isStopWord('and'), false);
      assert.strictEqual(stopwords.isStopWord('or'), false);
    });

    it('should normalize exceptions to lowercase', function () {
      stopwords.remove('THE');
      assert.strictEqual(stopwords.isStopWord('the'), false);
      assert.strictEqual(stopwords.isStopWord('The'), false);
    });

    it('should not affect other stopwords', function () {
      stopwords.remove('the');
      assert.strictEqual(stopwords.isStopWord('and'), true);
    });
  });

  // ─── reset ───────────────────────────────────────────────────────────────

  describe('reset', function () {
    it('should clear custom user words', function () {
      stopwords.add('customword');
      stopwords.reset();
      assert.strictEqual(stopwords.isStopWord('customword'), false);
    });

    it('should clear exceptions', function () {
      stopwords.remove('the');
      stopwords.reset();
      assert.strictEqual(stopwords.isStopWord('the'), true);
    });

    it('should clear both userWords and exceptions at once', function () {
      stopwords.add('custom');
      stopwords.remove('the');
      stopwords.reset();
      assert.strictEqual(stopwords.isStopWord('custom'), false);
      assert.strictEqual(stopwords.isStopWord('the'), true);
    });
  });

  // ─── Integration ─────────────────────────────────────────────────────────

  describe('Integration', function () {
    it('add + cleanText', function () {
      stopwords.add('custom');
      assert.strictEqual(stopwords.cleanText('this is custom text'), 'text');
    });

    it('remove + cleanText', function () {
      stopwords.remove('the');
      assert.strictEqual(stopwords.cleanText('the quick brown fox'), 'the quick brown fox');
    });

    it('add + remove: exception takes priority over user word', function () {
      stopwords.add('word');
      stopwords.remove('word');
      assert.strictEqual(stopwords.isStopWord('word'), false);
    });

    it('reset restores original behaviour after add/remove', function () {
      stopwords.add('myword');
      stopwords.remove('the');
      stopwords.reset();
      assert.strictEqual(stopwords.isStopWord('myword'), false);
      assert.strictEqual(stopwords.isStopWord('the'), true);
    });
  });

  // ─── Isolated instances (StopWords class) ────────────────────────────────

  describe('StopWords class (isolated instances)', function () {
    it('should create independent instances that do not share state', function () {
      const a = new StopWords();
      const b = new StopWords();
      a.add('uniqueword');
      assert.strictEqual(a.isStopWord('uniqueword'), true);
      assert.strictEqual(b.isStopWord('uniqueword'), false);
    });

    it('each instance should load all languages', function () {
      const instance = new StopWords();
      assert.ok(instance.availableLanguages.length > 0);
    });
  });
});
