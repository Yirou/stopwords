var assert = require('assert');
var stopwords=require('../lib/stopword');


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
      assert.equal(Object.keys(stopwords.getStopWords('fr')).indexOf('fr')>=0, true);
    });
  });
});