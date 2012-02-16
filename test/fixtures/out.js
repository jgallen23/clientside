var fixture = (function(exports) {
var cs1 = (function(exports) {
var ClassA = function() {
  console.log('ClassA init');
}


exports = ClassA;

return exports;
})({});
var cs2 = (function(exports) {
var ClassA = cs1;

var ClassB = function() {
  this.a = new ClassA();
  console.log('ClassB init');
};

exports = ClassB;

return exports;
})({});
var cs0 = (function(exports) {
var ClassA = cs1;
var ClassB = cs2;

var a = new ClassA();
var b = new ClassB();

exports = {
  a: a,
  b: b,
  ClassA: cs1
};

return exports;
})({});
return cs0;
})({});