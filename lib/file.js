var fs = require('fs');
var aug = require('aug');
var path = require('path');
var burrito = require('burrito');
var wrap = require('./wrap');

var lastId = 0;

var defaults = {
  prefix: 'cs'
};

var File = function(filename, options) {
  if (typeof filename === 'object') {
    options = filename;
    filename = null;
  }
  this.options = aug({}, defaults, options);
  this.generateId();
  if (filename) {
    this.filename = filename;
    this.dirname = path.dirname(filename);
    this.source = fs.readFileSync(filename, 'utf8');
  }
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

File.prototype.replace = function(search, replace, options) {
  options = options || 'g';
  this.source = this.source.replace(new RegExp(search, options), replace);
};

File.prototype.findDependencies = function() {
  var deps = [];
  var requires = this.source.match(/require\(.(.*?).\)/g);
  if (!requires)
    return deps;
  for (var i = 0, c = requires.length; i < c; i++) {
    var req = requires[i];
    var val = req.match(/\(.(.*?).\)/)[1];
    if (deps.indexOf(val) == -1)
      deps.push(val);
  }
  return deps;
};

File.prototype.replaceModuleExports = function() {
  this.replace('module.exports', 'exports');
};

File.prototype.replaceRequire = function(req, varName) {
  this.replace('require\\(.'+req+'.\\)', varName);
};

File.prototype._parse = function() {
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
  //this.replaceRequires();
  this.replaceModuleExports();
  //burrito
  //this.parse();
  this.wrap();
  return this.source;
};

File.prototype.wrap = function() {
  this.source = wrap(this.id, this.source);
};

module.exports = File;
