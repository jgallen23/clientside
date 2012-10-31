var aug = require('aug');

module.exports = function() {
  var a = { a: 1, b: 2 };
  var b = { b: 3, c: 3 };
  return aug({}, a, b);
};
