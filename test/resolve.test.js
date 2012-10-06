var assert = require('assert');
var path = require('path');
var resolve = require('../lib/resolve');

describe('resolve', function() {
  
  //TODO
  //it('should work with global modules', function() {
    //var p = f.resolveRequire('fs');
    //console.log(p);
    ////expect(p)
  //});

  it('should work with module names', function() {
    var p = resolve('mocha');
    assert.ok(p.match(/node_modules\/mocha\/index.js$/));
  });

  it('should work with relative paths', function() {
    var dir = path.join(__dirname, '/fixtures');
    var p = resolve('./b', dir); 
    assert.ok(p.match(/test\/fixtures\/b.js$/));

    p = resolve('../resolve.test.js', dir); 
    assert.ok(p.match(/test\/resolve.test.js$/));

    p = resolve('./test/test.js', dir); 
    assert.ok(p.match(/test\/fixtures\/test\/test.js$/));
  });
});
