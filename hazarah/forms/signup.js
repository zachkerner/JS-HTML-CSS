const noInputMessageObj = {
  'first_name': 'First name is a required field.',
  'last_name': 'Last name is a required field.',
  'email': 'Email is a required field.',
  'password': 'Password is a required field.'
}

const noMatchMessageObj = {
  'email': 'Please enter a valid email address.',
  'password': 'Please enter a password of at least 10 characters.',
  'phone': 'Please enter a valid US-style phone number.',
  'credit_card': 'Please enter a valid credit card number.'
}

let app = {
  bindEvents() {
    $('input').on('focusout', this.validateInputEvent.bind(this))
    $('input').on('focus', this.gainFocus.bind(this))
    $('form').on('submit', this.submitForm.bind(this))
    $('#first_name, #last_name').on('keypress', this.blockUnmatchName.bind(this))
    $('#phone').on('keypress', this.blockUnmatchPhoneNumber.bind(this))
    $('#credit1, #credit2, #credit3, #credit4').on('keydown', this.blockUnmatchCCNumber.bind(this))
    $('#credit1, #credit2, #credit3').on('keyup', this.autoTab.bind(this))
  },
  autoTab(event) {
    let element = event.target
    if (element.value.length === 4) {
      let nextCredit = element.nextElementSibling.nextElementSibling
      nextCredit.focus()
    }
  },
  blockUnmatchName(event) {
    let element = event.target
    let key = event.key
    if (!/[A-Za-z]/.test(key)) {
      event.preventDefault()
    }
  },
  blockUnmatchCCNumber(event) {
    let element = event.target
    let key = event.key
    if (key === 'Backspace') {
      return
    }
    if (!/\d/.test(key)) {
      event.preventDefault()
    }
  },
  blockUnmatchPhoneNumber(event) {
    let key = event.key
    if (!/\d|\-/.test(key)) {
      event.preventDefault()
    }
  },
  submitForm(event) {
    event.preventDefault()
    if (this.checkAllInputs()) {
      let data = this.serializeData()
      $('.serialized p').html(data)
    }
    if (!this.checkAllInputs()) {
      this.checkAndDisplay()
      let p = document.querySelector('.form_errors')
      p.textContent = "Please check input fields."
    }
  },
  serializeData() {
    let firstName = encodeURIComponent($('#first_name').val())
    let lastName = encodeURIComponent($('#last_name').val())
    let email = encodeURIComponent($('#email').val())
    let password = encodeURIComponent($('#password').val())
    let phone = encodeURIComponent($('#phone').val())
    let credit = $('#credit1').val() + $('#credit2').val() + $('#credit3').val() + $('#credit4').val()
    
    let string = `first_name=${firstName}&last_name=${lastName}&email=${email}&password=${password}&phone=${phone}&credit_card=${credit}`
    return string
  },
  checkAndDisplay() {
    let firstName = document.querySelector('#first_name')
    let lastName = document.querySelector('#last_name')
    let email = document.querySelector('#email')
    let password = document.querySelector('#password')

    this.validateInput(firstName)
    this.validateInput(lastName)
    this.validateInput(email)
    this.validateInput(password)
  },
  checkAllInputs() {
    let inputs = [...document.querySelectorAll('input')]
    return inputs.every(input => input.checkValidity())
  },
  validateInputEvent(event) {
    let element = event.target
    this.validateInput(element)
  },
  validateInput(element) {
    if (element.getAttribute('name') === 'credit_card') {
      this.validateCCInput(element)
      return
    }

    if (element.checkValidity()) {
      this.inputValid(element)
    }

    if (!element.checkValidity()) {
      if (!element.value) {
        let message = this.noInputMessageObj[element.getAttribute('id')]
        this.inputNotValid(element, message)
      }
      if (element.value) {
        let message = this.noMatchMessageObj[element.getAttribute('id')]
        this.inputNotValid(element, message)
      }
    }
  },
  validateCCInput(element) {
    if (element.checkValidity()) {
      this.inputValid(element)
    }

    if (!element.checkValidity()) {
      if (!element.value) {
        this.inputValid(element)
      }

      if (element.value) {
        this.inputNotValidCredit(element)
      }
    }
  },
  inputNotValid(element, message) {
    this.setMessage(element, message)
    this.turnRed(element)
  },
  inputNotValidCredit(element) {
    this.turnRed(element)
    let message = this.noMatchMessageObj['credit_card']
    let span = document.querySelector('#credit4').nextElementSibling
    span.textContent = message
  },
  gainFocus(event) {
    let element = event.target
    this.turnGreen(element)
    this.clearErrorMessage(element)
    if (element.getAttribute('name') === 'credit_card') {
      let creditSpan = document.querySelector('#credit4').nextElementSibling
      creditSpan.textContent = ""
    }
  },
  inputValid(element) {
    element.style.borderColor = '#ccc'
  },
  turnRed(element) {
    element.style.borderColor = 'red'
  },
  turnGreen(element) {
    element.style.borderColor = 'green'
  },
  clearErrorMessage(element) {
    element = $(element)
    let span = element.next('.error_message')
    span.textContent = ""
  },
  setMessage(element, message) {
    let span = element.nextElementSibling
    span.textContent = message
  },
  init() {
    this.bindEvents()
    this.noInputMessageObj = noInputMessageObj
    this.noMatchMessageObj = noMatchMessageObj
  }
}

$(function() {
  app.init()
})