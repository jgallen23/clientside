var DepTree = require('./deptree');
var File = require('./file');
var wrap = require('./wrap');
var resolve = require('./resolve');

var Library = function(name, filename) {
  if (arguments.length != 2) {
    throw new Error('name and filename are required');
  }
  this.name = name;
  this.files = {};
  this.shims = {};
  this.depTree = new DepTree();
  this.mainFilename = filename;
};

Library.prototype.getFile = function(filename) {
  if (!this.files[filename]) {
    var f = new File(this, filename);
    f.build();
    this.files[filename] = f;
  }
  return this.files[filename];
};

Library.prototype.requires = function(file, requiredFile) {
  this.depTree.add(file.filename, (requiredFile)?requiredFile.filename:null);
};

Library.prototype.addShim = function(filename, shim) {
  var shimFilepath = resolve(shim);
  var file = this.getFile(shimFilepath);
  this.shims[filename] = file;
};

Library.prototype.build = function() {
  //build index file
  this.main = this.getFile(this.mainFilename, true);
  this.requires(this.main);

  var list = this.depTree.getList();
  var src = [];
  for (var i = 0, c = list.length; i < c; i++) {
    var filepath = list[i];
    var file;
    if ((file = this.shims[filepath])) {
      file.id = this.files[filepath].id;
    } else {
      file = this.files[filepath];
    }
    file.wrap();
    src.push(file.source);
  }
  src = wrap(this.name, src.join('\n'), this.main.id);
  return src;
};

module.exports = Library;
