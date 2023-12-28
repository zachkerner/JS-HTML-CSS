var randomWord = (function() {
  var words = ["abacus", "quotient", "octothorpe", "proselytize", "stipend"];

  function without() {
    var new_arr = [],
        args = Array.prototype.slice.call(arguments);

    words.forEach(function(el) {
      if (args.indexOf(el) === -1) {
        new_arr.push(el);
      }
    });

    return new_arr;
  }

  return function() {
    var word = words[Math.floor(Math.random() * words.length)];
    words = without(word);
    return word;
  };
})();

class Game {
  constructor() {
    this.chosenWord = randomWord()
    console.log(this.chosenWord)
  }
}

new Game
