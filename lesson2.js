//setTimeout()

//1

// function delayLog() {
//   for (let i = 0; i <= 10; i ++) {
//     setTimeout(() => {
//       console.log(i)
//     }, i * 1000)
//   }
// }


// //4

// function afterNSeconds(callback, seconds) {
//   return setTimeout(callback, seconds * 1000)
// }


// //setInterval()

// //1
// let counterId;
// function startCounting() {
//   let count = 0
//   counterId = setInterval(() => {
//     console.log(count)
//     count++
//   }, 1000)
// }

// //2

// function stopCounting() {
//   clearInterval(counterId)
// }

// startCounting()
// stopCounting()

//Promises

//1
// let ls = new Promise((resolve, reject) => {
//   setTimeout(() => reject('Error: not like this'), 2000)
// })

// ls.then((message) => {
//   console.log(message)
// }).catch(message => {
//   console.log(message)
// })

//2

const promise = new Promise((resolve, reject) => {
  resolve("Got it!");
  reject("Oops.");
  resolve("Again!");
});

promise
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

