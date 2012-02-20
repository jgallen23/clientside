var AwesomeCalc = (function(exports) {
var cs1 = (function(exports) {

exports.add = function(num1, num2) {
  return num1 + num2;
}

return exports;
})({});
/*!
  * aug.js - A javascript library to extend existing objects and prototypes 
  * v0.0.1
  * https://github.com/jgallen23/aug
  * copyright JGA 2011
  * MIT License
  */

!function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
  else this[name] = definition();
}('aug', function() {

var aug = function __aug() {
  var args = Array.prototype.slice.call(arguments);
  var org = args.shift();
  for (var i = 0, c = args.length; i < c; i++) {
    var prop = args[i];
    for (var name in prop) {
      org[name] = prop[name];
    }
  }
  return org;
};

return aug;
});

var cs0 = (function(exports) {
var calc = cs1;
var aug = window.aug;

var Calculator = function(options) {
  var defaults = {
    debug: false
  }
  this.options = aug({}, defaults, options);
}

Calculator.prototype.add = function(num1, num2) {
  return calc.add(num1, num2);
}

exports = Calculator;

return exports;
})({});
return cs0;
})({});