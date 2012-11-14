var assert = require('assert');
var resolve = require('../lib/resolve/bower');

var path = require('path');
var fixturesDir = path.join(__dirname, 'fixtures');

suite('resolve', function() {

  suite('bower', function() {

    test('require("lib")', function() {
      var f = resolve('comp1', path.join(fixturesDir, 'a.js'));
      assert.equal(f, path.join(fixturesDir, 'components/comp1/lib/index.js'));
    });

    test('require("lib") from a sub directory', function() {
      var f = resolve('comp1', path.join(fixturesDir, 'test/test.js'));
      assert.equal(f, path.join(fixturesDir, 'components/comp1/lib/index.js'));
    });

    test('require("lib") that doesn\'t exist', function() {
      var f = resolve('invalid-comp', path.join(fixturesDir, 'test/test.js'));
      assert.equal(f, null);
    });

    test('require("lib/util.js")');
      //var f = resolve('comp1/lib/util.js', path.join(fixturesDir, 'test/test.js'));
      //assert.equal(f, path.join(fixturesDir, 'components/comp1/lib/util.js'));
    //});


    test('require without main');
    test('require using script as component.json property');
    test('require with main array');
    
  });

});

