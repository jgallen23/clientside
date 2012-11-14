

/**
 * resolve bower components 
 *
 * Examples:
 *
 *     resolve('aug', '/Users/jga/code/lib/bar.js') 
 *
 * @param {string} require
 * @param {string} file that made the require call
 * @return {string} full path to resolved require'd lib 
 * @api public
 */

var path = require('path');
var fs = require('fs');
var existsSync = fs.existsSync || path.existsSync;

module.exports = function(req, fromFile) {
  
  var dir = path.dirname(fromFile);
  var libPath = dir; 
  while (!existsSync(path.join(libPath, 'components'))) {
    libPath = path.resolve(libPath, '../');
    if (libPath == '/') {
      return null;
    }
  }

  var componentPath = path.join(libPath, 'components', req, 'component.json');
  if (!existsSync(componentPath)) {
    return null;
  }

  var json = JSON.parse(fs.readFileSync(componentPath, 'utf8'));
  var main = json.main;

  var mainFile = path.join(libPath, 'components', req, main);
  return mainFile;
}
