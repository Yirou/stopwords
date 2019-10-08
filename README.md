# stopwords
A collection of stopwords for many languages

<h3>Supported languages</h3>
<ul>
<li>
English
</li>
<li>
French
</li>
<li>
German
</li>
<li>
Italian
</li>
<li>
Russian
</li>
</ul>

## Installation
```
$ npm install n-stopwords
```
# Usager
```javascript
// Node
//Initialize
const stopwords=require('n-stopwords')(); 

//Set stopwords language
const stopwords=require('n-stopwords')(['fr','en']);

//Check if your word is an stopword
stopwords.isStopWord(your-word);

//Return french stopwords
stopwords.getStopWords(['fr']);

//Return all stopwords
stopwords.getStopWords();
```
## Include your custom words
You can append new words as stopwords

```javascript
stopwords.include(word);
//or
stopwords.include([{file:pathOfFile,encoding:encoding,separator:'\n'}];
//or
stopwords.include(['et','puis',voilà']);
```
words can be array of new files, array of stopwords or an stopword 

## Exclude custom words

You can also exclude words in stopwords if you don't need that one or many words appear as stopwords
```javascript
stopwords.exclude(words);
```
words can be array of files, array of stopwords or an stopword 


