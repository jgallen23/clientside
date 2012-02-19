var aug = require('aug');
var path = require('path');
var Library = require('./library');


module.exports = function(json) {

  var defaults = {
    name: 'ModuleName',
    main: 'index.js',
    shim: {},
    files: {}
  };

  var conf = aug(defaults, json, json.clientside);

  conf.main = path.join(process.cwd(), conf.main);
  return new Library(conf);
};
