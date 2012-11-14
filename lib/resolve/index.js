var fs = require('fs');
var path = require('path');
var existsSync = fs.existsSync || path.existsSync;
var bowerResolve = require('./bower.js');

/**
 * Description 
 *
 * Examples:
 *
 *     resolve('./foo', '/Users/jga/code/lib/bar.js') 
 *     resolve('/foo', '/Users/jga/code/lib/bar.js') 
 *     resolve('foo', '/Users/jga/code/lib/bar.js') 
 *
 * @param {string} description
 * @return {string} description 
 * @api public
 */
var resolve = function(req, fromFile) {
  var result;
  var dir = path.dirname(fromFile);

  if (req.match(/^\.|\//)) { //relative
    result = path.resolve(dir, req);
    result = require.resolve(result);
  }

  //bower
  if (!result) {
    result = bowerResolve(req, fromFile);
  }

  //npm
  if (!result) {
    result = require.resolve(req);
  }

  if (result && existsSync(result)) {
    return result;
  }
  throw new Error(result + ' cannot be found');
}

module.exports = resolve;
