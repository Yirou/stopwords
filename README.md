# stopwords
A collection of stopwords for many language
<h3> Usage</h3>
npm insatll n-stopwords
<pre>
<code>
// Node
//<strong>Initialize</strong>
const stopwords=require('n-stopwords')([]); 

//<strong>Set stopwords language</strong>
const stopwords=require('n-stopwords')(['fr','en']);

###################################################

//<strong>Check if your word is an stopword</strong>
stopwords.isStopWord(your-word);

//<strong>Return french stopwords</strong>
stopwords.getStopWords(['fr']);

//<strong>Return all stopwords</strong>
stopwords.getStopWords();

</code>
</pre>