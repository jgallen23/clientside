//built with clientside 0.3.0 https://github.com/jgallen23/clientside
if (typeof __cs == 'undefined') {
  var __cs = { 
    map: {}, 
    libs: {},
    r: function(p) {
      var mod = __cs.libs[__cs.map[p]];
      if (!mod) {
        throw new Error(p + ' not found');
      }
      return mod;
    }
  };
  window.require = __cs.r;
}
__cs.map['./a'] = 'csdad69378';
__cs.map['./b'] = 'cs1e34395e';

//a.js
__cs.libs.csdad69378 = (function(require, module, exports) {
var fnA = function() {
  return 'a';
};
module.exports = fnA;
return module.exports || exports;
})(__cs.r, {}, {});

//b.js
__cs.libs.cs1e34395e = (function(require, module, exports) {
var fnA = require('./a');
var fnB = function() {
  var a = fnA();
  return a + 'b';
};
module.exports = fnB;
return module.exports || exports;
})(__cs.r, {}, {});

//c.js
__cs.libs.cs8cda493f = (function(require, module, exports) {
var fnA = require('./a');
var fnB = require('./b');
var a = fnA();
var b = fnB();
module.exports = {
  a: a,
  b: b
};
return module.exports || exports;
})(__cs.r, {}, {});
var name = __cs.libs.cs8cda493f;


