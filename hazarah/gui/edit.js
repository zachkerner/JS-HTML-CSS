let app = {
  bindEvents() {
    $('button').on('click', this.highlight.bind(this))
  },
  highlight(event) {
    let element = event.target
    element.classList.toggle('clicked')

    if (element.classList.contains('list')) {
      console.log('yo')
      this.highlightLists(element)
    }

    if (element.classList.contains('align')) {
      this.highlightAlign(element)
    }
  },
  highlightAlign(element) {
    let alignClicked = [...document.querySelectorAll('.align.clicked')] 
 
    if (alignClicked.length === 0) {
      document.querySelector('.left').classList.add('clicked')
      return
    }

    if (alignClicked.length > 1) {
      alignClicked.forEach(n => {
        if (n !== element) {
          n.classList.remove('clicked')
        }
      })
    }
  },
  highlightLists(element) {
    let clickedLists = [...document.querySelectorAll('.clicked.list')]
      if (clickedLists.length === 2) {
        clickedLists.forEach(list => {
          if (list !== element) {
            list.classList.remove('clicked')
          }
        })
      } 
  },
  init() {
    this.bindEvents()
  }
}

$(function() {
  app.init()
})