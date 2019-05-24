# stopwords
A collection of stopwords for many language
<h3> Usage</h3>
npm insatll n-stopwords

// Node
const stopwords=require('n-stopwords')([]); 
or
const stopwords=require('n-stopwords')(['fr','en']); 
stopwords.isStopWord(your-word);

stopwords.getStopWords(['fr']);//return french stopwords

stopwords.getStopWords();//return all stopwords
