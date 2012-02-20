var calc = require('calc');
var aug = require('aug');

var Calculator = function(options) {
  var defaults = {
    debug: false
  }
  this.options = aug({}, defaults, options);
}

Calculator.prototype.add = function(num1, num2) {
  return calc.add(num1, num2);
}

module.exports = Calculator;
