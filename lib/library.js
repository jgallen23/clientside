var DepTree = require('./deptree');
var File = require('./file');
var wrap = require('./wrap');

var Library = function(name, filename) {
  if (arguments.length != 2) {
    throw new Error('name and filename are required');
  }
  this.name = name;
  this.files = {};
  this.depTree = new DepTree();
  this.root = this.getFile(filename, true);
  this.depTree.add(filename);
};

Library.prototype.getFile = function(filename, root) {
  if (!this.files[filename]) {
    var f = new File(this, filename);
    f.build(root);
    this.files[filename] = f;
  }
  return this.files[filename];
};

Library.prototype.requires = function(file, requiredFile) {
  this.depTree.add(file.filename, (requiredFile)?requiredFile.filename:null);
};

Library.prototype.build = function() {
  var list = this.depTree.getList();
  var src = [];
  for (var i = 0, c = list.length; i < c; i++) {
    var file = this.files[list[i]];
    src.push(file.source);
  }
  src = wrap(this.name, src.join('\n'));
  return src;
};

module.exports = Library;
