const cars = [
  { make: 'Honda', image: 'images/honda-accord-2005.jpg', model: 'Accord', year: 2005, price: 7000 },
  { make: 'Honda', image: 'images/honda-accord-2008.jpg', model: 'Accord', year: 2008, price: 11000 },
  { make: 'Toyota', image: 'images/toyota-camry-2009.jpg', model: 'Camry', year: 2009, price: 12500 },
  { make: 'Toyota', image: 'images/toyota-corrolla-2016.jpg', model: 'Corolla', year: 2016, price: 15000 },
  { make: 'Suzuki', image: 'images/suzuki-swift-2014.jpg', model: 'Swift', year: 2014, price: 9000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 25000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 26000 },
];

let app = {
  populateCars() {
    let carsTemplate = Handlebars.compile($('#cars_template').html())
    let carsDiv = $('#cars')
    carsDiv.html(carsTemplate({cars: cars}))
  },
  populateFilters() {
    let filtersTemplate = Handlebars.compile($('#filters_template').html())
    let filtersDiv = $('#filters')
    filtersDiv.html(filtersTemplate({cars: this.cars}))
  },
  eliminateDuplicateFilters() {
    let options = document.querySelectorAll('option')
    let values = []
    for (let i = 0; i < options.length; i ++) {
      if (values.includes(options[i]['value'])) {
        options[i].remove()
        continue
      }
      values.push(options[i]['value'])
    }
  },
  filterCars(e) {
    e.preventDefault()
    this.unhideAllCarDivs()
    let filtersList = {}
    filtersList['make'] = document.querySelector('#make').value
    filtersList['model'] = document.querySelector('#model').value
    filtersList['year'] = document.querySelector('#year').value
    filtersList['price'] = document.querySelector('#price').value
    
    let carDivs = document.querySelectorAll('.car')
    for (let key in filtersList) {
      if (filtersList[key].startsWith('all')) {
        continue
      }
      for (let i = 0; i < carDivs.length; i ++) {
        console.log(carDivs[i])
        if (carDivs[i].style.display === 'none') {
          continue
        }
        if (carDivs[i].getAttribute(`data-${key}`) !== filtersList[key]) {
          console.log(carDivs[i])
          carDivs[i].style.display = 'none'
        }
      }
    }
  },
  unhideAllCarDivs() {
    let carDivs = [...document.querySelectorAll('.car')]
    carDivs.forEach(car => {
      car.style.display = 'inline-block'
    })
  },
  unhideAllModels() {
    let modelOptions = [...document.querySelectorAll('#make option')]
    modelOptions.forEach(option => option.style.display = "inline")
  },
  filterModel() {
    this.unhideAllModels()
    let make = document.querySelector('#make')
    let makeSelected = make['value']
    if (makeSelected === 'All') {
      return
    }
    let models = [...document.querySelectorAll('#model option')]
    models.forEach(model => {
      if (!this.makesAndModels[makeSelected].includes(model['value'])) {
        model.style.display = 'none'
      }
    })

  },
  makesAndModels() {
    let hash = {}
    this.cars.forEach(car => {
      hash[car['make']] ? hash[car['make']].push(car['model']) : hash[car['make']] = [car['model']]
    })
    return hash
  },
  bindEvents() {
    $('.filter_btn').on('click', this.filterCars.bind(this))
    $('#make').on('change', this.filterModel.bind(this))
  },
  init() {
    this.cars = cars
    this.makesAndModels = this.makesAndModels()
    this.populateCars()
    this.populateFilters()
    this.eliminateDuplicateFilters()
    this.bindEvents()
  }
}


$(function() {
  app.init()
})