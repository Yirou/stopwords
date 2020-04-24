# stopwords
A collection of stopwords for many languages

<h3>Supported languages</h3>

| Language | Code |
| --- | --- |
| Arabic    |   ar   |
| Chinese   |   zh   |
| English   |   en   |
| French    |   fr   |
| German    |   de   |
| Italian   |   it   |
| Russian   |   ru   |
| Spanish   |   es   |
| Yoruba    |   yo   |

## Installation
```
$ npm install n-stopwords
```
## Usage
```javascript
// Node
//Initialize with all languages
const stopwords=require('n-stopwords')(); 

//Or set stopwords languages
const stopwords=require('n-stopwords')(['fr','en','es','yo']);

//Check if your word is an stopword
stopwords.isStopWord(your-word);

//Return french stopwords
stopwords.getStopWords(['fr']);

//Return all stopwords
stopwords.getStopWords();

//Remove stopwords from text
//for this example 'Et' and 'voilà' are stopwords
let result=stopwords.cleanText('Et puis voilà');
//expected 
result='puis'
```
## Append your custom words
You can append new words as stopwords

```javascript
stopwords.add(word);
//or
stopwords.add([{file:pathOfFile,encoding:encoding,separator:'\n'}];
//or
stopwords.add(['et','puis','voilà']);

```
words can be array of new files, array of stopwords or an stopword 

## Exclude custom words

You can also exclude words in stopwords if you don't need that one or many words appear as stopwords
```javascript
stopwords.remove(words);
```
words can be array of files, array of stopwords or an stopword 


