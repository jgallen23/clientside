var fnA = require('./a');
var fnB = require('./b');

var a = fnA();
var b = fnB();

module.exports = {
  a: a,
  b: b
};
