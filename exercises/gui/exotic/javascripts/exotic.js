document.addEventListener('DOMContentLoaded', event => {
  let images = document.querySelectorAll('img')
  images.forEach(image => {
    image.addEventListener('mouseover', event => {
      //event.stopPropagation()
      let div = image.nextElementSibling
      setTimeout(() => {
        div.classList.remove('hide')
        div.classList.add('show')
      }, 2000)
     
    })
  })
  document.addEventListener('mouseover', event => {
    let shownDiv = document.querySelector("[class='modal show']")
    if (shownDiv) {
      shownDiv.classList.remove('show')
      shownDiv.classList.add('hide')
    }
    console.log(shownDiv)
  }, true)
})