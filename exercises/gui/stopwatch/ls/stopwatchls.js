document.addEventListener('DOMContentLoaded', event => {
  let startTime = Date.now() //remember to reset with reset

  let startStop = document.querySelector('.toggle')
  startStop.addEventListener('click', event => {
    event.preventDefault()
    if (startStop.textContent === 'Start') {
      startStop.textContent = 'Stop'
    } else {
      startStop.textContent = 'Start'
    }

    let centisecs = document.querySelector('.centisecs')
    let secs = document.querySelector('.secs')
    let minutes = document.querySelector('.mins')
    let hours = document.querySelector('.hours')

    let timerTracker = setInterval(() => {
      let timeElapsed = Date.now() - startTime
      let centisecsElapsed = parseInt(timeElapsed/10)

    }, 10)

    // if (startStop.textContent === 'Stop') {
    //   clearInterval(timerTracker)
    // }
  })
})