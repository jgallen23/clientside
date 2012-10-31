var assert = require('assert');
var clientside = require('../');
var vm = require('vm');
var fs = require('fs');

var fixtureDir = __dirname + '/fixtures/';
var version = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version;

//helper to run clientside in a sandbox
var run = function(results, done) {
  var sandbox = {
    window: {},
    __cs: undefined,
    name: undefined,
    console: {
      log: function() {}
    }
  };

  //console.log(results);
  vm.runInNewContext(results, sandbox);
  var out = sandbox;
  //console.log(out);
  return out;
};

suite('clientside', function() {

  test('should expose the current version of clientside', function() {
    assert.ok(clientside.version, version);
  });

  test('should return error if main not passed', function(done) {
    clientside({}, function(err, results) {
      assert.notEqual(err, null);
      assert.equal(err.message, 'main property must be passed in');
      done();
    });
  });

  test('invalid file', function(done) {
    clientside({
      main: fixtureDir + 'bad-file.js', 
      name: 'name'
    }, function(err, results) {
      assert.notEqual(err, null);
      done();
    });
  });

  test('missing dep file', function(done) {
    clientside({
      main: fixtureDir + 'invalid-dep.js', 
      name: 'name'
    }, function(err, results) {
      assert.notEqual(err, null);
      done();
    });
  });

  suite('build with module name', function() {
    var out;
    var source;

    setup(function(done) {
      clientside({
        main: fixtureDir + 'c.js', 
        name: 'name'
      }, function(err, results) {
        source = results;
        out = run(results);
        done();
      });
    });

    test('should add comment to top with clientside version', function() {
      assert.ok(source.match(/built with clientside/));
      assert.ok(source.match('built with clientside '+version));
    });

    test('should create __cs object', function() {
      assert.equal(typeof out.__cs, 'object');
      assert.equal(typeof out.__cs.map, 'object');
      assert.equal(typeof out.__cs.libs, 'object');
      assert.equal(typeof out.__cs.r, 'function');
    });

    test('should have found two unique requires', function() {
      assert.equal(typeof out.__cs.map['./a'], 'string');
      assert.equal(typeof out.__cs.map['./b'], 'string');
    });

    test('should have loaded 3 libs', function() {
      var count = 0;
      for (var key in out.__cs.libs) {
        count++;
      }
      assert.equal(count, 3);
    });

    test('require(./a) should return a function', function() {
      //__cs.r == require inside module
      assert.equal(typeof out.__cs.r('./a'), 'function');
      assert.equal(out.__cs.r('./a')(), 'a');
    });

    test('require(./b) should return a function', function() {
      assert.equal(typeof out.__cs.r('./b'), 'function');
      assert.equal(out.__cs.r('./b')(), 'ab');
    });

    test('name should be results from c.js', function() {
      assert.equal(typeof out.name, 'object');
      assert.equal(out.name.a, 'a');
      assert.equal(out.name.b, 'ab');
    });

    test('should expose global require function', function() {
      assert.equal(typeof out.window.require, 'function');
      assert.equal(typeof out.window.require('./b'), 'function');
      assert.equal(out.window.require('./b')(), 'ab');
    });
  });

  suite('build without module name', function() {
    var source;
    var out;

    setup(function(done) {
      clientside({
        main: fixtureDir + 'c.js'
      }, function(err, results) {
        source = results;
        out = run(results);
        done();
      });
    });

    test('should have loaded 3 libs', function() {
      var count = 0;
      for (var key in out.__cs.libs) {
        count++;
      }
      assert.equal(count, 3);
    });

  });

  //suite('build with node module');
  

  suite('exclude', function() {

    test('can exclude lib from build', function(done) {
      clientside({
        main: fixtureDir + 'b.js',
        excludes: ['./a']
      }, function(err, results) {
        //console.log(results);
        assert.equal(results, fs.readFileSync(fixtureDir + 'b.exclude.js', 'utf8'));
        done();
      });
      
    });
    
  });
  

});
