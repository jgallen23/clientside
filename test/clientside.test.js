var assert = require('assert');
var clientside = require('../');
var fs = require('fs');
var run = require('./sandbox');

var fixtureDir = __dirname + '/fixtures/';
var version = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version;


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
      assert.equal(typeof out.window.name, 'object');
      assert.equal(out.window.name.a, 'a');
      assert.equal(out.window.name.b, 'ab');
    });

    test('should expose global require function', function() {
      assert.equal(typeof out.window.require, 'function');
      assert.equal(typeof out.window.require('./b'), 'function');
      assert.equal(out.window.require('./b')(), 'ab');
    });

    test('should require name', function() {
      assert.equal(typeof out.window.require('name'), 'object');
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

  suite('build with node module (aug)', function() {

    var out;
    var source;
    setup(function(done) {
      clientside({
        main: fixtureDir + 'req-node-module.js',
        name: 'extend'
      }, function(err, results) {
        source = results;
        out = run(results);
        done();
      });
    });

    test('execute', function() {
      //from req-node-module.js
      //var a = { a: 1, b: 2 };
      //var b = { b: 3, c: 3 };
      assert.deepEqual(out.window.extend(), { a: 1, b: 3, c: 3});
    });

    //test('__cs.libs.aug should exist because its a known module', function() {
      //assert.equal(typeof out.__cs.libs.aug, 'function');
    //});

    test('require("aug")', function() {
      assert.equal(typeof out.window.require('aug'), 'function');
    });
  });
  

  suite('exclude', function() {

    var source;
    setup(function(done) {
      clientside({
        main: fixtureDir + 'b.js',
        excludes: ['./a']
      }, function(err, results) {
        //console.log(results);
        source = results;
        done();
      });
    });

    test('should only have one loaded lib', function() {
      assert.equal(source.match(/__cs.libs.cs/g).length, 1);
    });

    test('should not find a.js', function() {
      assert.equal(source.match(/a.js/), null);
    });
    
  });

  suite('returns', function() {

    var source;
    setup(function(done) {
      clientside({
        main: fixtureDir + 'returns-test.js',
        returns: 'a',
        name: 'a'
      }, function(err, results) {
        source = results;
        done();
      });
    });

    test('should return a', function() {
      assert.ok(source.match(/return a;/));
    });

    test('should expose a as a function', function() {
      var out = run(source);
      assert.equal(typeof out.window.a, 'function');
      assert.equal(out.window.a(), 'a');
    });
    
  });
  

  suite('build two files separately and run them in the same context', function() {

    var out;
    var source;

    setup(function(done) {
      clientside({
        main: fixtureDir + 'a.js',
        name: './a'
      }, function(err, results) {
        var a = results;
        clientside({
          main: fixtureDir + 'b.js',
          name: 'exp',
          excludes: ['./a']
        }, function(err, results) {
          source = a + '\n' + results;
          out = run(source);
          done();
        });
      });
    });

    test('require("./a")', function() {
      assert.equal(typeof out.window.require('./a'), 'function');
    });

    test('execute b', function() {
      assert.equal(typeof out.window.exp, 'function');
      assert.equal(out.window.exp(), 'ab');
    });
    
  });
  
  

});
