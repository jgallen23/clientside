var SomeAwesomePackage = (function(exports) {
  var cs0 = (function(exports) {
    exports = function() {
      console.log("this will make ajax calls");
    };

    return exports;
  })({});
  var cs2 = (function(exports) {
    var http = cs0;

    var ClassA = function() {
      console.log('ClassA init');
    };

    exports = ClassA;

    return exports;
  })({});
  var cs1 = (function(exports) {
    var ClassA = cs2;

    var ClassB = function() {
      this.a = new ClassA();
      console.log('ClassB init');
    };

    exports = ClassB;

    return exports;
  })({});
  return cs1;
})({});
