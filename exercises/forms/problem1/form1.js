function validateFirst(name) {
  return name ? "" : "Please enter a first name."
}

document.addEventListener('DOMContentLoaded', event => {
  let form = document.querySelector('form')
  form.addEventListener('click', event => {
    event.stopPropagation()
    if (event.target.tagName === 'INPUT') {
      event.target.classList.add('focus')
      event.target.classList.remove('error')
      event.target.nextSibling.textContent = ""
      if (!event.target.classList.contains('clicked')) {
        event.target.classList.add('clicked')
      }
    }
  })

  document.addEventListener('click', event => {
    //event.stopPropagation()
    if (event.target.classList.contains('focus')) {
      return
    }

    let focusedElement = document.querySelector('.focus')
    if (focusedElement) {
      focusedElement.classList.remove('focus')
    }

    let clicked = document.querySelectorAll('.clicked')
    console.log(clicked)
    clicked.forEach(element => {
      if (element.id === 'first') {
        let error = validateFirst(element.value)
        element.nextSibling.textContent = error
        if (error) {
          element.classList.add('error')
        } else {
          element.classList.remove('error')
        }
      }
    })

    
  }, true)


})