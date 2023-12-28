let form = document.querySelector('form')


form.addEventListener('submit', event => {
    event.preventDefault()
    console.log('i was clicked!')

    let first = Number(form['first'].value)
    let second = Number(form['second'].value)
    let operator = form['operator'].value

    let answer = document.getElementById('answer')

    switch(operator) {
      case('+'):
        answer.textContent = first + second
        break
      case('-'):
        answer.textContent = first - second
        break
      case('.'):
        answer.textContent = first * second
        break
      case('/'):
        answer.textContent = first / second
        break
    }
    
})