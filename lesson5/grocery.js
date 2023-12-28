document.addEventListener('DOMContentLoaded', event => {
  console.log('your mom')
  
let form = document.querySelector('form')

form.addEventListener('submit', event => {
    event.preventDefault();

    let item = form['item'].value
    let quantity = form['quantity'].value || '1'

    let listItem = document.createElement('li')
    listItem.textContent = quantity + " " + item
    let list = document.querySelector('#list')
    list.appendChild(listItem)
    form.reset();
})

})