var ClassA = require('./a');

var ClassB = function() {
  this.a = new ClassA();
  console.log('ClassB init');
};

module.exports = ClassB;
