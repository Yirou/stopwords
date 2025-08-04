const assert = require('assert');
const stopwords = require('../lib/stopwords');

describe('StopWords Library', function() {

  describe('isStopWord', function() {
    it('should return false when word is not a stopword', function() {
      assert.strictEqual(stopwords.isStopWord('Bonjour'), false);
      assert.strictEqual(stopwords.isStopWord('programming'), false);
    });

    it('should return object with isStopWord true when word is a stopword', function() {
      const result = stopwords.isStopWord('the');
      assert.strictEqual(typeof result, 'boolean');
      assert.strictEqual(result, true);
    });

    it('should be case insensitive', function() {
      const resultLower = stopwords.isStopWord('the');
      const resultUpper = stopwords.isStopWord('THE');
      const resultMixed = stopwords.isStopWord('The');

      assert.deepStrictEqual(resultLower, resultUpper);
      assert.deepStrictEqual(resultLower, resultMixed);
    });

    it('should handle non-string input', function() {
      assert.strictEqual(stopwords.isStopWord(123), false);
      assert.strictEqual(stopwords.isStopWord(null), false);
    });
  });

  describe('getStopWords', function() {
    it('should return all stopwords when no language specified', function() {
      const result = stopwords.getStopWords();
      assert.ok(Array.isArray(result));
      assert.ok(result.length === 0);
    });

    it('should return specific language stopwords', function() {
      const frenchStopwords = stopwords.getStopWords('fr');
      assert.ok(frenchStopwords[0]);
      assert.strictEqual(frenchStopwords[0].lang, 'fr');
      assert.ok(Array.isArray(frenchStopwords[0].data));
    });

    it('should handle array of languages', function() {
      const multiLangStopwords = stopwords.getStopWords(['fr', 'en']);
      assert.ok(Array.isArray(multiLangStopwords));
      assert.strictEqual(multiLangStopwords.length, 2);
    });

    it('should return undefined for non-existent language', function() {
      const result = stopwords.getStopWords('nonexistent');
      assert.strictEqual(result.length, 0);
    });
  });

  describe('cleanText', function() {
    it('should remove stopwords from text', function() {
      const result = stopwords.cleanText('et puis voilà');
      assert.strictEqual(result, 'puis');
    });

    it('should handle empty string', function() {
      const result = stopwords.cleanText('');
      assert.strictEqual(result, '');
    });

    it('should handle custom separator', function() {
      const result = stopwords.cleanText('et,puis,voilà', ',');
      assert.strictEqual(result, 'puis');
    });

    it('should preserve non-stopwords', function() {
      const result = stopwords.cleanText('hello world programming');
      assert.strictEqual(result, 'world programming');
    });

    it('should handle mixed case', function() {
      const result = stopwords.cleanText('Et PUIS voilà');
      assert.strictEqual(result, 'PUIS');
    });
  });

  describe('add', function() {
    beforeEach(function() {
      // Reset userWords before each test
      stopwords.userWords = [];
    });

    it('should add single word to userWords', function() {
      stopwords.add('customword');
      const result = stopwords.isStopWord('customword');
      assert.strictEqual(result, true);
    });

    it('should add array of words to userWords', function() {
      stopwords.add(['word1', 'word2', 'word3']);
      assert.strictEqual(stopwords.isStopWord('word1'), true);
      assert.strictEqual(stopwords.isStopWord('word2'), true);
      assert.strictEqual(stopwords.isStopWord('word3'), true);
    });
  });

  describe('remove', function() {
    beforeEach(function() {
      // Reset exceptions before each test
      stopwords.exceptions = [];
    });

    it('should add words to exceptions', function() {
      stopwords.remove('the');
      assert.strictEqual(stopwords.isStopWord('the'), false);
    });

    it('should handle array of words', function() {
      stopwords.remove(['the', 'and', 'or']);
      assert.strictEqual(stopwords.isStopWord('the'), false);
      assert.strictEqual(stopwords.isStopWord('and'), false);
      assert.strictEqual(stopwords.isStopWord('or'), false);
    });
  });

  describe('Integration tests', function() {
    it('should work with add and cleanText together', function() {
      stopwords.userWords = []; // Reset
      stopwords.add('custom');
      const result = stopwords.cleanText('this is custom text');
      assert.strictEqual(result, 'text');
    });

    it('should work with remove and cleanText together', function() {
      stopwords.exceptions = []; // Reset
      stopwords.remove('the');
      const result = stopwords.cleanText('the quick brown fox');
      assert.strictEqual(result, 'the quick brown fox');
    });
  });
});