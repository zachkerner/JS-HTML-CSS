const cars = [
  { make: 'Honda', image: 'images/honda-accord-2005.jpg', model: 'Accord', year: 2005, price: 7000 },
  { make: 'Honda', image: 'images/honda-accord-2008.jpg', model: 'Accord', year: 2008, price: 11000 },
  { make: 'Toyota', image: 'images/toyota-camry-2009.jpg', model: 'Camry', year: 2009, price: 12500 },
  { make: 'Toyota', image: 'images/toyota-corrolla-2016.jpg', model: 'Corolla', year: 2016, price: 15000 },
  { make: 'Suzuki', image: 'images/suzuki-swift-2014.jpg', model: 'Swift', year: 2014, price: 9000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 25000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 26000 },
];

let carsUnique = {
  make: [],
  model: [],
  price: [],
  year: []
}

function makeUnique(...args) {
  let keys = Array.prototype.slice.call(args)
  keys.forEach( key => {
    cars.forEach(car => {
      if (carsUnique[key].indexOf(car[key]) === -1) {
        carsUnique[key].push(car[key])
      }
    })
  })
}

function addAllAny() {
  for (let key in carsUnique) {
    if (key === 'make' || key === 'model') {
      carsUnique[key].unshift('All')
    } else {
      carsUnique[key].unshift('Any')
    }
  }
}

function populateSelections() {
  let obj = {}
  obj['make'] = document.querySelector('#make').value
  obj['model'] = document.querySelector('#model').value
  obj['year'] = document.querySelector('#year').value;
  obj['price'] = document.querySelector('#price').value;
  return obj
}



makeUnique('make', 'model', 'year', 'price')
addAllAny()

document.addEventListener('DOMContentLoaded', event => {
  let menuDiv = $('#filters')
  let filterTemp = Handlebars.compile($('#filterTemp').html())

  menuDiv.html(filterTemp(carsUnique))

  function carStats() {
    let carArr = []
    let cars = document.querySelectorAll('.car')
    cars.forEach(car => {
      let carObj = {};
      carObj.id = car.getAttribute('data-id')

      let h2 = car.querySelector('h2')
      carObj.make = h2.textContent.split(" ")[0]
      carObj.model = h2.textContent.split(" ")[1]
  
      carObj.year = car.querySelector('.year').textContent.match(/\d+/g)[0]
      carObj.price = car.querySelector('.price').textContent.match(/\d+/g)[0]
      carArr.push(carObj)
    })
    return carArr
  }

  function hideFilteredCars(carArr, selectionObj) {
    carArr.forEach(car => {
      for (let key in selectionObj) {
        if (selectionObj[key] === 'Any' || selectionObj[key] === 'All') {
          continue
        }
        if (selectionObj[key] !== car[key]) {
          let id = car.id
          let carInDom = document.querySelector(`[data-id='${id}']`)
          carInDom.classList.add('hide')
          break
        }
      }
    })
  }

  function unHideAll() {
    let cars = document.querySelectorAll('.car')
    cars.forEach(car => {
      car.classList.remove('hide')
    })
  }

  let filterButton = document.querySelector('#filterButton')
  filterButton.addEventListener('click', event => {
    event.preventDefault()
    let selections = populateSelections()
    let carArr = carStats()
    unHideAll()
    hideFilteredCars(carArr, selections)

  })
})