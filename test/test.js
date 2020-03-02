var assert = require('assert');
var stopwords=require('../lib/stopwords')();


describe('isStopWord', function() {
  describe('#It should return Object', function() {
    it('should return Object when word is an stopword or return false if not', function() {
      assert.equal(stopwords.isStopWord('Newmips'), false);
    });
  });
});

describe('Get stopwords files', function() {
  describe('#It should return Object', function() {
    it('should return french stopwords if fr is set as lang or should return all stopwords', function() {
      assert.equal(stopwords.getStopWords('fr')[0].lang, 'fr');
    });
  });
});

describe('Clean stopwords from text', function() {
  describe('#It should return text', function() {
    it('should return text without stopword', function() {
      assert.equal(stopwords.cleanText('et puis voilà'), 'puis');
    });
  });
});