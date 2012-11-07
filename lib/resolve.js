var path = require('path');
var glob = require('glob');
var fs = require('fs');
var existsSync = fs.existsSync || path.existsSync;

module.exports = function(reqPath, dir) {
  //TODO: refactor

  //check for bower component.json
  var componentPath = path.join(dir, 'components', reqPath, 'component.json');
  if (existsSync(componentPath)) {
    var json = JSON.parse(fs.readFileSync(componentPath, 'utf8'));
    var main = json.main;

    var mainFile = path.join(dir, 'components', reqPath, main);
    return mainFile;
  }

  var modPath;
  try {
    modPath = require.resolve(reqPath);
  } catch(e) {
    var fullPath = reqPath;
    if (reqPath.match(/^\./)) {
      fullPath = path.join(dir, reqPath);
      if (!dir.match(/^\//)) {
        fullPath = path.join(process.cwd(), fullPath);
      }
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
