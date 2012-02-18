var expect = require('chai').expect;
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
    expect(p).to.match(/node_modules\/mocha\/index.js$/);
  });

  it('should work with relative paths', function() {
    var dir = path.join(__dirname, '/fixtures');
    var p = resolve('./b', dir); 
    expect(p).to.match(/test\/fixtures\/b.js$/);
    p = resolve('../file.test.js', dir); 
    expect(p).to.match(/test\/file.test.js$/);
    p = resolve('./test/test.js', dir); 
    expect(p).to.match(/test\/fixtures\/test\/test.js$/);
  });
});
