var assert = require('assert');
var clientside = require('../');
var vm = require('vm');
var fs = require('fs');

var fixtureDir = __dirname + '/fixtures/';
var version = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version;

//helper to run clientside in a sandbox
var run = function(options, done) {
  clientside(options, function(err, results) {
    if (err) {
      return done(err);
    }
    var sandbox = {
      window: {},
      __cs: undefined,
      name: undefined,
      console: {
        log: function() {}
      }
    };

    var source = results;
    //console.log(source);
    vm.runInNewContext(results, sandbox);
    var out = sandbox;
    //console.log(out);
    done(err, source, out);
  });
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
    run({
      main: fixtureDir + 'bad-file.js', 
      name: 'name'
    }, function(err, s, o) {
      assert.notEqual(err, null);
      done();
    });
  });

  test('missing dep file', function(done) {
    run({
      main: fixtureDir + 'invalid-dep.js', 
      name: 'name'
    }, function(err, s, o) {
      assert.notEqual(err, null);
      done();
    });
  });

  suite('build with module name', function() {
    var out;
    var source;

    setup(function(done) {
      run({
        main: fixtureDir + 'c.js', 
        name: 'name'
      }, function(err, s, o) {
        source = s;
        out = o;
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
      run({
        main: fixtureDir + 'c.js'
      }, function(err, s, o) {
        source = s;
        out = o;
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

});
