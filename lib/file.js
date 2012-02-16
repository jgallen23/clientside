var fs = require('fs');
var aug = require('aug');
var path = require('path');
var burrito = require('burrito');
var wrap = require('./wrap');

var lastId = 0;

var defaults = {
  prefix: 'cs'
};

/*
new File(depTree, options)
  .source('txt')
  .file('filename')
  .replaceRequires()
  .replaceModuleExports()
  .processDependencies()
  .wrap()


new File(options)
  .compile('filename')

new File(, options)
*/

var File = function(library, filename, options) {
  if (!library)
    throw new Error('instance of library is required');
  if (typeof filename === 'object') {
    options = filename;
    filename = null;
  }
  this.library = library;
  this.options = aug({}, defaults, options);
  this.generateId();
  if (filename) {
    this.filename = filename;
    this.dirname = path.dirname(filename);
    this.source = fs.readFileSync(filename, 'utf8');
  }
};

File.prototype.resolveRequire = function(reqPath) {
  var fullPath = reqPath;
  if (reqPath.match(/^\./)) {
    fullPath = path.join(this.dirname, reqPath);
  }
  return require.resolve(fullPath);
  
};

File.prototype.generateId = function() {
  if (!this.id)
    this.id = this.options.prefix+(lastId++);
  return this.id;
};

File.prototype.setSource = function(src) {
  this.source = src;
  this.dirname = __dirname;
};

File.prototype.replaceRequires = function() {
  var requires = this.source.match(/require\(.(.*?).\)/g);
  if (!requires)
    return;
  for (var i = 0, c = requires.length; i < c; i++) {
    var req = requires[i];
    var val = req.match(/\(.(.*?).\)/)[1];
    var filePath = this.resolveRequire(val);
    var file = this.library.getFile(filePath);
    this.requires(file);
    this.source = this.source.replace(req, file.id);
  }
};

File.prototype.replaceModuleExports = function() {
  this.source = this.source.replace(/module.exports/g, 'exports');
};

File.prototype.requires = function(file) {
  var f = this.library.requires(this, file);
  return f;
};

File.prototype.parse = function() {
  var self = this;
  this.source = burrito(this.source, function(node) {
    //if (node.name == 'call')
      //console.log(node.start.value);
    if (node.name == 'call' && node.start.value == 'require') {
      var val = node.value[1][0][1];
      var filePath = self.resolveRequire(val);
      var file = self.library.getFile(filePath);
      self.requires(file);
      node.wrap(file.id);
    } else if (node.name == 'stat' && node.start.value == 'module' && node.value[0][2][2] == 'exports') {
      var n = node.value[0][3];
      var str = burrito.deparse(n, true);
      str = "exports = "+str;
      var newNode = burrito.parse(str);
      node.state.update(newNode, true);
    }
  });
  return this;
};

File.prototype.build = function() {
  //TODO get burrito working
  //regex
  this.replaceRequires();
  this.replaceModuleExports();
  //burrito
  //this.parse();
  if (!this.root)
    this.wrap();
};

File.prototype.wrap = function() {
  this.source = wrap(this.id, this.source);
};

module.exports = File;
