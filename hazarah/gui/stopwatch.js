let app = {
  bindEvents() {
    $('.toggle').on('click', this.startTimer.bind(this))
    $('.reset').on('click', this.reset.bind(this))
  },
  startTimer() {
    let button = $('.toggle')
    if (button.html() === 'Start') {
      this.start = this.start || Date.now()
      button.html('Stop')
      this.interval = setInterval(() => {
        this.updateClock()
      }, 5)
      return
    }

    if (button.html() === 'Stop') {
      this.stopTimer()
      button.html('Start')
    }
  },
  reset() {
    this.stopTimer()
    this.start = 0
    $('.toggle').html('Start')
    this.clearInterface()
  },
  clearInterface() {
    $('span').html('00')
  },
  updateClock() {
    this.current = Date.now()
    let totalTime = this.current - this.start
    let [ hours, minutes, seconds, centiseconds ]= this.calculateTime(totalTime)

    $('.hours').html(this.convertNumber(hours))
    $('.mins').html(this.convertNumber(minutes))
    $('.secs').html(this.convertNumber(seconds))
    $('.centisecs').html(this.convertNumber(centiseconds))
  },
  convertNumber(number) {
    return String(number).length === 2 ? String(number) : "0" + String(number)
  },
  calculateTime(totalTime) {
    const milliSecInHour = 3600000
    const milliSecInMinute = 60000
    const milliSecinSec = 1000

    let hours = Math.floor(totalTime/milliSecInHour)
    let remainAfterHours = totalTime - (hours * milliSecInHour)
    let minutes = Math.floor(remainAfterHours/milliSecInMinute)
    let remainAfterMinutes = remainAfterHours - (minutes * milliSecInMinute)
    let seconds = Math.floor(remainAfterMinutes/milliSecinSec)
    let remainAfterSeconds = remainAfterMinutes - (seconds * milliSecinSec)
    let centiseconds = Math.floor(remainAfterSeconds/10)

    return [hours, minutes, seconds, centiseconds]
  },
  stopTimer() {
    clearInterval(this.interval)
    //this.current = Date.now()
  },
  init() {
    this.start;
    this.current;
    this.bindEvents()
  }
}

$(function() {
  app.init()
})