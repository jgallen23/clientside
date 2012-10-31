var assert = require('assert');
var clientside = require('../');
var vm = require('vm');
var fs = require('fs');

var fixtureDir = __dirname + '/fixtures/';
var version = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version;

//helper to run clientside in a sandbox
var run = function(file, name, done) {
  clientside(file, name, function(err, results) {

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
    done(source, out);
  });
};

describe('clientside', function() {

  it('should expose the current version of clientside', function() {
    assert.ok(clientside.version, version);
  });

  describe('build', function() {
    var out;
    var source;

    beforeEach(function(done) {
      run(fixtureDir + 'c.js', 'name', function(s, o) {
        source = s;
        out = o;
        done();
      });
    });

    it('should add comment to top with clientside version', function() {
      assert.ok(source.match(/built with clientside/));
      assert.ok(source.match('built with clientside '+version));
    });

    it('should create __cs object', function() {
      assert.equal(typeof out.__cs, 'object');
      assert.equal(typeof out.__cs.map, 'object');
      assert.equal(typeof out.__cs.libs, 'object');
      assert.equal(typeof out.__cs.r, 'function');
    });

    it('should have found two unique requires', function() {
      assert.equal(typeof out.__cs.map['./a'], 'string');
      assert.equal(typeof out.__cs.map['./b'], 'string');
    });

    it('should have loaded 3 libs', function() {

      var count = 0;
      for (var key in out.__cs.libs) {
        count++;
      }
      assert.equal(count, 3);
    });

    it('require(./a) should return a function', function() {
      //__cs.r == require inside module
      assert.equal(typeof out.__cs.r('./a'), 'function');
      assert.equal(out.__cs.r('./a')(), 'a');
    });

    it('require(./b) should return a function', function() {
      assert.equal(typeof out.__cs.r('./b'), 'function');
      assert.equal(out.__cs.r('./b')(), 'ab');
    });
    
    it('name should be results from c.js', function() {
      assert.equal(typeof out.name, 'object');
      assert.equal(out.name.a, 'a');
      assert.equal(out.name.b, 'ab');
    });

    it('should expose global require function', function() {
      assert.equal(typeof out.window.require, 'function');
      assert.equal(typeof out.window.require('./b'), 'function');
      assert.equal(out.window.require('./b')(), 'ab');
    });

    
  });
  
});
