var path = require('path');
var glob = require('glob');

module.exports = function(reqPath, dir) {
  var modPath;
  try {
    modPath = require.resolve(reqPath);
  } catch(e) {
    var fullPath = reqPath;
    if (reqPath.match(/^\./)) {
      fullPath = path.join(dir, reqPath);
    } else {
      //search tree
      var files = glob('**/'+reqPath, { sync: true });
      if (files.length === 0) {
        throw new Error(reqPath + ' not found');
      }
      fullPath = path.join(process.cwd(), files[0]);
    }
    modPath = require.resolve(fullPath);
  }
  return modPath;
};
