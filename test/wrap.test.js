var expect = require('chai').expect;
var wrap = require('../lib/wrap');

describe('wrap', function() {
  var varName = 'cs1';
  var source = 'var a = 1;'
  it('should wrap with variable name and source', function() {
    var out = wrap(varName, source);
    expect(out).to.match(new RegExp('^var '+varName+' = '));
    expect(out).to.match(new RegExp(source));
    expect(out).to.match(/return exports/);
  });
  it('should take custom return variable', function() {
    var out = wrap(varName, source, 'a');
    expect(out).to.match(new RegExp('^var '+varName+' = '));
    expect(out).to.match(new RegExp(source));
    expect(out).to.match(new RegExp('return a;'));
  });
  
});
