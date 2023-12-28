let app = {
  bindEvents() {
    $('.digit').on('click', this.enterDigit.bind(this))
    $('.op').on('click', this.enterOp.bind(this))
    $('.result_button').on('click', this.calculate.bind(this))
  },
  calculate(event) {
    event.preventDefault()
    let operatingWindowVal = document.querySelector('.calculation').textContent
    let entryVal = document.querySelector('.current_num').textContent

    let opNumsArr = operatingWindowVal.split(" ")
    opNumsArr.push(entryVal)
    opNumsArr = opNumsArr.slice(1)
    let total = this.crawlAndCalc(opNumsArr)
  },
  crawlAndCalc(arr) {
    arr = arr.map(elem => {
      if (/\d+/.test(elem)) {
        return Number(elem)
      }
      return elem
    })
    let total = arr[0]
    let op;
    arr.slice(1).forEach(elem => {
      if (typeof elem === 'number') {
        if (op === "+") {
          total += elem
          return
        }
        if (op === "-") {
          total = total - elem
          return
        }
        if (op === 'x') {
          total *= elem
          return
        }
        if (op === '-') {
          total = total / elem
          return
        }
        if (op === '%') {
          total = total % elem
          return
        }
      }
      if (typeof elem === 'string') {
        op = elem
      }

    })
    return total
  },
  enterOp(event) {
    event.preventDefault()
    let operationWindow = document.querySelector('.calculation')
    let operationWindowVal = operationWindow.textContent
    let keyValue = event.target.textContent
    let entryWindow = document.querySelector('.current_num')
    let entryWindowVal = entryWindow.textContent

    operationWindow.textContent = operationWindowVal + " " + entryWindowVal + " " + keyValue
    this.operation = true

  },
  enterDigit(event) {
    event.preventDefault()
    let element = event.target
    let keyValue = element.textContent
    let entryWindow = document.querySelector('.current_num')
    let currentNum = entryWindow.textContent

    if (currentNum === "0" || this.operation) {
      entryWindow.textContent = keyValue
      this.operation = false
      return
    }

    entryWindow.textContent = currentNum + keyValue
  },
  init() {
    this.bindEvents()
    this.operation = false
  }
}


document.addEventListener('DOMContentLoaded', event => {
  app.init()
})