var fnA = require('./a');

var fnB = function() {
  var a = fnA();
  return a + 'b';
};

module.exports = fnB;
