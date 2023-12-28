const questions = [
  {
    id: 1,
    description: "Who is the author of <cite>The Hitchhiker's Guide to the Galaxy</cite>?",
    options: ['Dan Simmons', 'Douglas Adams', 'Stephen Fry', 'Robert A. Heinlein'],
  },
  {
    id: 2,
    description: 'Which of the following numbers is the answer to Life, the \
                  Universe and Everything?',
    options: ['66', '13', '111', '42'],
  },
  {
    id: 3,
    description: 'What is Pan Galactic Gargle Blaster?',
    options: ['A drink', 'A machine', 'A creature', 'None of the above'],
  },
  {
    id: 4,
    description: 'Which star system does Ford Prefect belong to?',
    options: ['Aldebaran', 'Algol', 'Betelgeuse', 'Alpha Centauri'],
  },
];

const answerKey = { '1': 'Douglas Adams', '2': '42', '3': 'A drink', '4': 'Betelgeuse' };


let app = {
  populateQuestions() {
    let questionsTemplate = Handlebars.compile($('#questions_template').html())
    let $fieldset = $('fieldset')
    $fieldset.html(questionsTemplate({questions: questions}))
  },
  checkAnswers(event) {
    event.preventDefault()
    let $selected = [...$('input:checked')]
    let submitButton = document.querySelector('.submit')
    let resetButton = document.querySelector('.reset_form')
    submitButton.setAttribute('disabled', 'disabled')
    resetButton.removeAttribute('disabled')
    

    for (let key in answerKey) {
      let matchingElem = $selected.find(elem => elem.getAttribute('name') === key)
      let correctAnswer = answerKey[key]
      let div = document.querySelector(`#q${key}`)
      let resultP = div.lastElementChild

      if (!matchingElem) {
        resultP.classList.add('wrong')
        resultP.textContent = `You did not answer this question. The correct answer is ${correctAnswer}`
        continue
      }

      if (matchingElem.value !== correctAnswer) {
        resultP.classList.add('wrong')
        resultP.textContent = `Sorry the correct answer is ${correctAnswer}.`
      }

      if (matchingElem.value === correctAnswer) {
        resultP.classList.add('correct')
        resultP.textContent = "You got it!!"
      }

    }
  },
  bindEvents() {
    $('.submit').on('click', this.checkAnswers.bind(this))
    $('.')
  },
  init() {
    this.questions = questions
    this.answerKey = answerKey
    this.populateQuestions()
    this.bindEvents()
  }
}


$(function() {
  app.init()
})