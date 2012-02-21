var ClassB = (function(exports) {
  var cs1 = (function(exports) {
    var ClassA = function() {
      console.log('ClassA init');
    }

    exports = ClassA;

    return exports;
  })({});
  var cs0 = (function(exports) {
    var ClassA = cs1;

    var ClassB = function() {
      this.a = new ClassA();
      console.log('ClassB init');
    };

    exports = ClassB;

    return exports;
  })({});
  return cs0;
})({});
