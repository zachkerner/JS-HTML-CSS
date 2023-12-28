//1

function randomizer(...nCallbacks) {
  let n = nCallbacks.length
  let callBackArray = Array.prototype.slice.call(nCallbacks)

  for (let i = 1; i <= n * 2; i++) {
    setTimeout(() => console.log(i), i * 1000)
  }

  for (let j = 0; j < callBackArray.length; j ++) {
    let randomTime = Math.floor(Math.random() * 2 * n) + 1
    setTimeout(() => callBackArray[j].call(), randomTime * 1000 )
    
  }
}

function a() {
  console.log('a')
}
function b() {
  console.log('b')
}
function c() {
  console.log('c')
}

//randomizer(a, b, c)

//2

//contains method


//3

// > let sectionElement = document.querySelector('section');
// > makeBold(sectionElement, function(elem) {
//     elem.classList.add('highlight');
//   });

// > sectionElement.classList.contains('highlight');
// = true
// > sectionElement.style.fontWeight;
// = "bold"

function makeBold(elem, cb) {
  elem.style.fontWeight = 'bold'
  cb(elem)
}