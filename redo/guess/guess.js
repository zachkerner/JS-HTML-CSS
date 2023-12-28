class Game {
  constructor() {
    this.allowedGuesses = 6
    this.words = ['apple', 'banana', 'orange', 'pear']
    this.word = this.randomWord()
    this.incorrectGuesses = 0;
    this.guessedLetters = []
    this.createWordBlanks()
    this.bindEvents()
  }

  bindEvents() {
    document.addEventListener('keypress', this.handleGuess.bind(this))
    let replay = document.querySelector('#replay')
    replay.addEventListener('click', this.playAnother.bind(this))
  }

  playAnother(event) {
    event.preventDefault()
    this.hideReplay()
    this.hideEndGameMessage()

    this.clearBodyClass()
    document.removeEventListener('keypress', this.handleGuess.bind(this))
    this.resetGame()
  }

  resetGame() {
    this.clearWordAndGuess()
    this.word = this.randomWord() || this.showSorryMessage()
    this.guessedLetters = []
    this.incorrectGuesses = 0
    let apples = document.querySelector('#apples')
    apples.classList = ""

    this.createWordBlanks()
  }

  clearWordAndGuess() {
    let blanks = document.querySelectorAll('span')
    for (let blank of blanks) {
      blank.remove()
    }
  }

  handleGuess(event) {
    if (!event) return;

    let key = event.key
    if (key.charCodeAt() < 96 || key.charCodeAt() > 122) return;
    
    if (this.guessedLetters.includes(key)) return;

    this.writeLetterToGuessed(key)

    let idxes = []
    for (let i = 0; i < this.word.length; i ++) {
      if (this.word[i] === key) {
        idxes.push(i)
      }
    }

    if (idxes.length === 0) {
      this.incorrectGuesses++
      let apples = document.querySelector('#apples')
      apples.classList.remove(`guess_${this.incorrectGuesses - 1}`)
      apples.classList.add(`guess_${this.incorrectGuesses}`)

      if (this.incorrectGuesses === this.allowedGuesses) {
        this.triggerLoss()
      }
    }

    if (idxes.length > 0) {
      let wordSpans = [...document.querySelectorAll('#spaces span')]
      idxes.forEach(idx => {
        wordSpans[idx].textContent = key
      })

      if (wordSpans.every(span => span.textContent)) {
        this.triggerWin()
      }
    }
  }

  triggerWin() {
    document.body.classList.add('win')
    this.showEndGameMessage(true)
    this.showReplay()
    document.removeEventListener('keypress', this.handleGuess())
  }

  triggerLoss() {
    document.body.classList.add('lose')
    this.showEndGameMessage(false)
    this.showReplay()
    document.removeEventListener('keypress', this.handleGuess())
  }

  showReplay() {
    let replay = document.querySelector('#replay')
    replay.style.display = 'inline-block'
  }

  hideReplay() {
    let replay = document.querySelector('#replay')
    replay.style.display = 'none'
  }

  showEndGameMessage(bool) {
    let p = document.querySelector('#message')
    if (bool) {
      p.textContent = 'Hooray you win.'
    } else {
      p.textContent = 'Sorry you lose.'
    }
  }

  hideEndGameMessage() {
    let p = document.querySelector('#message')
    p.textContent = ""
  }

  clearBodyClass() {
    document.body.classList = ""
  }

  writeLetterToGuessed(letter) {
    this.guessedLetters.push(letter)

    let span = document.createElement('span')
    span.textContent = letter
    document.querySelector('#guesses').appendChild(span)
  }

  randomWord() {
    let idx = Math.floor(Math.random() * this.words.length)

    return this.words.length > 0 ? this.words.splice(idx, 1)[0] : undefined
  }

  showSorryMessage() {
    let p = document.querySelector('#message')
    p.textContent = "Sorry we're out of words."

    document.body.classList.add('win')
  }

  createWordBlanks() {
    for (let i = 0; i < this.word.length; i++) {
      let span = document.createElement('span')
      let div = document.querySelector('#spaces')
      div.appendChild(span)
    }
  }
}

document.addEventListener('DOMContentLoaded', event => {
  new Game()
})



