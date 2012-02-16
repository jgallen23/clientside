var ClassA = require('./a');
var ClassB = require('./b');

var a = new ClassA();
var b = new ClassB();

module.exports = {
  a: a,
  b: b,
  ClassA: require('./a')
};
