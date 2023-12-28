document.addEventListener('DOMContentLoaded', event => {
  const message = document.querySelector("#message");
  const letters = document.querySelector("#spaces");
  const guesses = document.querySelector("#guesses");
  const apples = document.querySelector("#apples");
  const replay = document.querySelector("#replay");
  const numGuesses = 6;

  var randomWord = function() {
    var words = ['apple', 'banana', 'orange', 'pear'];

    return function() {
      var word = words[Math.floor(Math.random() * words.length)];
      words.splice(words.indexOf(word), 1);
      return word;
    };
  }();

  function Game() {
    this.incorrect = 0;
    this.lettersGuessed = [];
    this.correctSpaces = 0;
    this.word = randomWord();
    if (!this.word) {
      this.displayMessage("Sorry, I've run out of words!");
      return this;
    }
    this.word = this.word.split("");
    this.init();
  }

  Game.prototype = {
    createBlanks: function() {
      let spaces = (new Array(this.word.length + 1)).join("<span></span>");

      let spans = letters.querySelectorAll("span");
      spans.forEach(span => {
        span.parentNode.removeChild(span);
      });
      letters.insertAdjacentHTML('beforeend', spaces);
      this.spaces = document.querySelectorAll("#spaces span");
    },
    displayMessage: function(text) {
      message.text(text);
    },
    updateGuessed: function(letter) {
      this.addLetterToGuessed(letter)
      this.displayGuess(letter)
    },
    addLetterToGuessed: function(letter) {
      this.lettersGuessed.push(letter)
    },
    checkLetterInWord: function(letter) {
      let idxes = []
      for (let i = 0; i < this.word.length; i++) {
        if (this.word[i] === letter) {
          idxes.push(i)
        }
      }
      return idxes.length > 0 ? idxes : undefined
    },
    displayGuess: function(letter) {
      let span = document.createElement('span')
      span.textContent = letter
      let guesses = document.querySelector('#guesses')
      guesses.appendChild(span)
    },
    init: function() {
      this.createBlanks();
    }
  };

  let game = new Game();

  document.addEventListener('keydown', event => {
    const ACODE = 97
    const ZCODE = 122
    let key = event.key
    let code = key.charCodeAt()

    if (code < ACODE || code > ZCODE) {
      return
    }

    if (game.lettersGuessed.indexOf(key) !== -1) {
      return
    }

    game.updateGuessed(key)

    let idxes = game.checkLetterInWord(key)

    if (!idxes) {
      game.incorrect++
      apples.className = ""
      apples.classList.add(`guess_${game.incorrect}`)
      if (game.incorrect >= numGuesses) {
        
      }
      return
    }

    let wordSpans = document.querySelectorAll('#spaces span')

    idxes.forEach(idx => {
      wordSpans[idx].textContent = key
    })
  
  })
});









