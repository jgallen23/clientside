var res = require('resistance');
var fs = require('fs');
var detective = require('detective');
var resolve = require('./resolve');
var path = require('path');
var DepTree = require('deptree');
var Handlebars = require('handlebars');
var aug = require('aug');
require('./handlebars');

var version = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version;

var readFile = function(done, obj) {
  fs.readFile(obj.filename, 'utf8', function(err, source) {
    if (err) return done(err);

    obj.basepath = path.dirname(obj.filename);
    obj.basename = path.basename(obj.filename);
    obj.source = source;
    done(null, obj);
  });
}

var generateId = function(done, obj) {
  obj.id = 'cs'+Math.round(Math.random()*1000000)
  done(null, obj)
}

var findRequires = function(done, obj) {
  obj.deps = {};
  var deps = detective(obj.source);
  deps.forEach(function(dep) {
    obj.deps[dep] = '';
  });
  done(null, obj);
}

var resolveRequires = function(done, obj) {

  obj.resolvedDeps = [];
  for (var key in obj.deps) {
    var res = resolve(key, obj.basepath);
    obj.deps[key] = res;
    obj.resolvedDeps.push(res);
  };

  done(null, obj);
}

var addToDepTree = function(done, obj) {

  var self = this;
  obj.depTree.add(obj.filename, obj.resolvedDeps);
  obj.resolvedDeps.forEach(function(file) {
    self.push({ filename: file, depTree: obj.depTree });
  });

  done(null, obj);
}

var formatData = function(moduleName, callback) {
  return function(err, results) {
    var self = this;
    var depTree = results.depTree;
    var order = depTree.resolve();
    var deps = {};
    var files = {} 
    self.forEach(function(file) {
      var f = file[1];
      files[f.filename] = f;
      aug(deps, f.deps);
    });
    generate(err, moduleName, order, files, deps, callback);
  }
}

var generate = function(err, moduleName, order, files, deps, callback) {

  fs.readFile(__dirname + '/template.handlebars', 'utf8', function(err, source) {
    var fn = Handlebars.compile(source);
    var out = fn({ files: files, order: order, deps: deps, moduleName: moduleName, version: version });

    //console.log(files);
    cleanup(err, out, callback);
  });
}
var cleanup = function(err, out, callback) {
  out = out.replace(/(\r\n\r\n|\n\n|\r\r)/gm, '\n');
  callback(err, out);
}

var clientside = function(rootFile, moduleName, callback) {

  var depTree = new DepTree();
  
  res()
    .queue([{ filename: rootFile, depTree: depTree }])
    .use(readFile)
    .use(generateId)
    .use(findRequires)
    .use(resolveRequires)
    .use(addToDepTree)
    .end(formatData(moduleName, callback));
}

clientside.version = version;

module.exports = clientside;
