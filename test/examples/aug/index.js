
!function (name, definition) {
  if (typeof module != 'undefined' && exports) exports = definition();
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
