
export default class Speaker {

  constructor() {
    this.speechDefault = {}
    this.speechDefault.lang = 'en-US';
    this.speechDefault.voiceURI = 'native';
    this.speechDefault.volume = 1;
    this.speechDefault.rate = 1;
    this.speechDefault.pitch = 1;
    this.synth = window.speechSynthesis;
    this.lastText = null;
    this.lastSpeed = null;
    this.defaultSpeeds = { slow: 0.6, normal: 1, fast: 1.8 };
    this.onEnd = null;
  }

  speak(words, part = -1, onEnd = null) {
    this.onEnd = onEnd;

    const unit = words.length / 4;
    const repeat = 4;

    const speechTexts = [];
    for (let i = 0; i < repeat; i++) {
      if (part >= 0 && part != i) {
        continue;
      }

      const unitWords = [];
      for (let j = 0; j < unit; j++) {
        let w = words[i * unit + j];
        if (w.word) {
          w = w.word;
        }
        unitWords.push(w);
        // unitWords.push(words[i * unit + j].word.toUpperCase().replace(/(.)/g, '$1 '));
        // unitWords.push(', ')
      }

      speechTexts.push(unitWords.join(' '));
    }

    const text = speechTexts.join(', ');
    this.speakText(text);
  }

  speakText(text) {
    const speech = new SpeechSynthesisUtterance();
    speech.onend = (e) => {
      if (this.onEnd) {
        this.onEnd(e);
      }
    }
    Object.assign(speech, this.speechDefault);

    if (this.synth.speaking) {
      this.synth.cancel();

      if (this.lastText == text) {
        if (this.lastSpeed == this.defaultSpeeds.slow) {
          this.lastSpeed = this.defaultSpeeds.fast;
        } else if (this.lastSpeed == this.defaultSpeeds.fast) {
          this.lastSpeed = null;
          return;
        } else {
          this.lastSpeed = this.defaultSpeeds.slow;
        }
        speech.rate = this.lastSpeed;
      } else {
        this.lastSpeed = null;
      }
    } else {
      this.lastSpeed = null;
    }

    speech.text = text;
    this.lastText = text;
    this.synth.speak(speech);
  }

  speakWord(word) {
    this.onEnd = null;
    let text = word + ",\n" + word.toUpperCase().replace(/(.)/g, '$1 ');
    this.speakText(text)
  }

  speakSequence(wordsSequence, cursor = -1) {
    if (cursor == -1) {
      if (this.cursor > 0) {
      } else {
        this.cursor = 0;
      }
    } else {
      this.cursor = cursor;
    }
    const onEnd = (e) => {
      if (wordsSequence.length > this.cursor + 1) {
        this.speakSequence(wordsSequence, this.cursor + 1);
      }
    };
    this.speak(wordsSequence[this.cursor], -1, onEnd);
  }

  pause() {
    this.onEnd = null;
    this.synth.cancel();
  }

  reset() {
    this.cursor = 0;
    this.pause();
  }
}
