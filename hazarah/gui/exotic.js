let app = {
  init() {
    this.bindEvents()
  },
  showToolTip(event) {
    let $figcap = $(event.target).next().fadeIn(300)
    $figcap.css('position', 'absolute')
  },
  unshowToolTip(event) {
    let $figcap = $(event.target).next().fadeOut(300)
  },
  startTimer(event) {
    setTimeout(() => {
      this.showToolTip(event).bind(this)
    }, 1000)
  },
  bindEvents() {
    $('#exotic_animals').on('mouseenter', 'img', this.startTimer.bind(this))
    $('#exotic_animals').on('mouseleave', 'img', this.unshowToolTip.bind(this))
  }
}


$(function() {
  app.init()
})