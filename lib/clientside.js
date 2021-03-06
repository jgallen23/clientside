var res = require('resistance');
var fs = require('fs');
var crypto = require('crypto');
var detective = require('detective');
var resolve = require('./resolve');
var path = require('path');
var DepTree = require('deptree');
var Handlebars = require('handlebars');
var aug = require('aug');
require('./handlebars');

var version = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version;

var defaults = function(done, obj) {
  var defaults = {
    excludes: []
  };
  obj = aug({}, defaults, obj);
  done(null, obj);
};
var readFile = function(done, obj) {
  fs.readFile(obj.main, 'utf8', function(err, source) {
    if (err) return done(err);

    obj.basepath = path.dirname(obj.main);
    obj.basename = path.basename(obj.main);
    obj.source = source;
    done(null, obj);
  });
};

var generateId = function(done, obj) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(obj.main);
  var d = md5sum.digest('hex');
  obj.id = 'cs'+d.substr(0, 8);
  done(null, obj);
};

var findRequires = function(done, obj) {
  obj.deps = {};
  var deps = detective(obj.source);
  deps.forEach(function(dep) {
    if (obj.excludes.indexOf(dep) == -1) {
      obj.deps[dep] = '';
    }
  });
  done(null, obj);
};

var resolveRequires = function(done, obj) {

  obj.resolvedDeps = [];
  for (var key in obj.deps) {
    try {
      var res = resolve(key, obj.main);
      obj.deps[key] = res;
      obj.resolvedDeps.push(res);
    } catch(e) {
      return done(e);
    }
  }

  done(null, obj);
};

var addToDepTree = function(done, obj) {

  var self = this;
  obj.depTree.add(obj.main, obj.resolvedDeps);
  obj.resolvedDeps.forEach(function(file) {
    self.push({ main: file, depTree: obj.depTree });
  });

  done(null, obj);
};

var formatData = function(callback) {
  return function(err, results) {
    if (err) {
      return callback(err);
    }
    var self = this;
    var depTree = results.depTree;
    var order = depTree.resolve();
    var deps = {};
    var files = {};
    self.forEach(function(file) {
      var f = file[1];
      files[f.main] = f;
      aug(deps, f.deps);
    });
    generate(err, order, files, deps, callback);
  };
};

var generate = function(err, order, files, deps, callback) {

  fs.readFile(__dirname + '/template.handlebars', 'utf8', function(err, source) {
    var fn = Handlebars.compile(source);
    var out = fn({ files: files, order: order, deps: deps, version: version });

    //console.log(files);
    cleanup(err, out, callback);
  });
};

var cleanup = function(err, out, callback) {
  out = out.replace(/(\r\n\r\n|\n\n|\r\r)/gm, '\n');
  callback(err, out);
};

var clientside = function(opts, callback) {
  if (!opts.main) {
    return callback(new Error('main property must be passed in'));
  }

  opts.depTree = new DepTree();
  
  res()
    .queue([opts])
    .use(defaults)
    .use(readFile)
    .use(generateId)
    .use(findRequires)
    .use(resolveRequires)
    .use(addToDepTree)
    .end(formatData(callback));
};

clientside.version = version;

module.exports = clientside;
