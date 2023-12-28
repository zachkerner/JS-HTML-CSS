todo_items = [
  { id: 1, title: 'Homework' },
  { id: 2, title: 'Shopping' },
  { id: 3, title: 'Calling Mom' },
  { id: 4, title: 'Coffee with John '}
];

function showToHide(...args) {
  let arguments = Array.prototype.slice.call(args)
  arguments.forEach(argument => {
    argument.classList.remove('show')
    argument.classList.add('hide')
  })
}

function hideToShow(...args) {
  let arguments = Array.prototype.slice.call(args)
  arguments.forEach(argument => {
    argument.classList.remove('hide')
    argument.classList.add('show')
  })
}

document.addEventListener('DOMContentLoaded', event => {
  let ulList = $('#list')
  let todoTemplate = Handlebars.compile($('#todos').html())
  ulList.html(todoTemplate({todos: todo_items}))

  let overlay = document.querySelector('.overlay')
  let dialog = document.querySelector('.dialog')
  let currentId;

  let spans = document.querySelectorAll('span')
  spans.forEach(span => {
    span.addEventListener('click', event => {
      hideToShow(overlay, dialog)
      currentId = span.parentElement.getAttribute('data-id')
    })
  })

  overlay.addEventListener('click', event => {
    if (overlay.classList.contains('hide')) {
      return
    }
    showToHide(overlay, dialog)
  })

  let noButton = document.querySelector('.no');
  noButton.addEventListener('click', event => {
    showToHide(overlay, dialog)
  })

  let yesButton = document.querySelector('.yes')
  yesButton.addEventListener('click', event => {
    let relevantLi = document.querySelector(`[data-id="${currentId}"]`)
    relevantLi.classList.add('hide')
    showToHide(overlay, dialog)
  })
})