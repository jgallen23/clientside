var DepTree = require('./deptree');
var File = require('./file');
var wrap = require('./wrap');
var resolve = require('./resolve');
var path = require('path');
var aug = require('aug');


var Library = function(options) {
  var defaults = {
    name: 'moduleName',
    shim: {},
    files: {},
    settings: {}
  };
  this.meta = aug({}, defaults, options);
  this.depTree = new DepTree();
  this.shims = {};
  this.settings = {};

  if (this.meta.main) {
    this.meta.main = path.resolve(this.meta.main);
    if (!fs.existsSync(this.meta.main)) {
      throw new Error(this.meta.main+' doesn\'t exist');
    }
    this.dirname = path.dirname(this.meta.main);
  } else {
    this.dirname = process.cwd();
  }

  this.processSettings();
  this.processShims();

  //must be after process shims
  if (this.meta.main) {
    this.main = this.addFile(this.meta.main);
  }

};

Library.prototype.addFile = function(filename, key) {
  key = key || filename;
  var f = this.meta.files[key];
  if (!f) {
    f = new File(filename, this.settings[key]);
    this.meta.files[key] = f;
    this.addDependencies(f);
  }
  return f;
};

Library.prototype.processSettings = function() {
  for (var key in this.meta.settings) {
    var filepath = resolve(key, this.dirname);
    this.settings[filepath] = this.meta.settings[key];
  }
};

Library.prototype.processShims = function() {
  for (var key in this.meta.shim) {
    var filepath = this.meta.shim[key];
    var shim = resolve(filepath, this.dirname);
    var fileToReplace = resolve(key, this.dirname);
    this.shims[shim] = fileToReplace;
    this.addFile(shim, fileToReplace);
  } 
};

Library.prototype.addDependencies = function(file) {
  //grab all of the require() from the file
  var deps = file.findDependencies();

  for (var i = 0, c = deps.length; i < c; i++) {
    var dep = deps[i];
   
    //resolve full path of depencency (./a => /home/user/code/blah/a.js)
    var depFullPath = resolve(dep, file.dirname);
    
    //add to library
    var depFile = this.addFile(depFullPath);

    //add to dependency tree
    this.depTree.add(file.filename, depFile.filename);

    //replace all instances of require('./a') with id (require('./a') => cs10)
    file.replaceRequire(dep, depFile.id);
  }

  //if no dependences, add to depTree so it will end up in the list when building
  if (deps.length === 0) {
    this.depTree.add(file.filename);
  }
};

Library.prototype.build = function() {

  var list = this.depTree.getList();
  var src = [];
  for (var i = 0, c = list.length; i < c; i++) {
    var filepath = list[i];
    filepath = this.shims[filepath] || filepath;
    var file = this.meta.files[filepath];
    file.build();
    src.push(file.source);
  }
  this.source = wrap(this.meta.name, src.join('\n'), this.main.id);
  return this.source;

};

module.exports = Library;
