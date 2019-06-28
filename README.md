# stopwords
A collection of stopwords for many languages

<h3>Supported languages</h3>
<ul>
<li>
French
</li>
<li>
English
</li>
<li>
Italian
</li>
</ul>
<h3> Usage</h3>
npm install n-stopwords
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
