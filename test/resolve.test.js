var assert = require('assert');
var path = require('path');
var resolve = require('../lib/resolve');

suite('resolve', function() {
  
  //TODO
  //test('should work with global modules', function() {
    //var p = f.resolveRequire('fs');
    //console.log(p);
    ////expect(p)
  //});

  test('should work with module names', function() {
    var p = resolve('mocha');
    assert.ok(p.match(/node_modules\/mocha\/index.js$/));
  });

  test('should work with relative paths', function() {
    var dir = path.join(__dirname, '/fixtures');
    var p = resolve('./b', dir); 
    assert.ok(p.match(/test\/fixtures\/b.js$/));

    p = resolve('../resolve.test.js', dir); 
    assert.ok(p.match(/test\/resolve.test.js$/));

    p = resolve('./test/test.js', dir); 
    assert.ok(p.match(/test\/fixtures\/test\/test.js$/));
  });

  test('should work with bower components', function() {

    var dir = path.join(__dirname, '/fixtures');
    var p = resolve('test-comp', dir);

    assert.ok(p.match(/test\/fixtures\/components\/test-comp\/lib\/index.js/));
  });
});
