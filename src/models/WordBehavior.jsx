import speechSynth from '../models/SpeechSynth.jsx';

export default class WordBehavior {
  constructor() {
  }

  exec(word, name, keyword = '') {
    let q = encodeURIComponent(word);
    switch(name) {
    case 'image':
      window.open('https://www.google.com/search?safe=off&source=lnms&tbm=isch&q=' + q);
      break;
    case 'speech':
      speechSynth.speakWord(word);
      break;
    case 'keyword':
      keyword = encodeURIComponent(keyword);
      window.open('https://www.google.com/search?safe=off&q=' + q + '+' + keyword);
      break;
    case 'webster':
      window.open('https://www.merriam-webster.com/dictionary/' + q);
      break;
    case 'wikipedia':
      window.open('https://en.wikipedia.org/wiki/' + q);
      break;
    case 'twitter':
      window.open('https://twitter.com/search?q=' + q);
      break;
    case 'tumblr':
      window.open('https://www.tumblr.com/search/' + q);
      break;
    case 'ebay':
      window.open('http://www.ebay.com/sch/?_nkw=' + q);
      break;
    }
  }
}

