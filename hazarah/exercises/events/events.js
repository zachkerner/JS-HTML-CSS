//1 - Randomizer

function randomizer(...callbacks) {
  let callbackArr = Array.prototype.slice.call(callbacks)

  let totalTime = callbackArr.length * 2

  for (let i = 1; i <= totalTime; i ++) {
    setTimeout(() => console.log(i), 1000 * i)
  }

  callbackArr.forEach(callback => {
    setTimeout(() => {
      callback()
    }, Math.random() * totalTime * 1000)
  })
}

function a() {
  console.log('hi')
}

function b() {
  console.log('bye')
}

function c() {
  console.log('guy')
}

randomizer(a, b, c)



