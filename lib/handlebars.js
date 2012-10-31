var Handlebars = require('handlebars');

Handlebars.registerHelper('eachFromMap', function(array, hash, options) {

  var fn = options.fn;
  var ret = "";
  array.forEach(function(item, i) {
    ret += fn({ item: hash[item], isLast: (array.length == i+1) });
  });

  return ret;
});

Handlebars.registerHelper('lookup', function(obj, key, key2, options) {
  var out = obj[key];
  return (key2) ? out[key2] : out; 
});

Handlebars.registerHelper('eachObject', function(obj, options) {

  var fn = options.fn;
  var ret = "";
  for (var key in obj) {
    ret += fn({ key: key, value: obj[key] });
  }

  return ret;
});

Handlebars.registerHelper('console', function() {
  console.log(arguments);
});
