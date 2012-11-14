var assert = require('assert');
var path = require('path');
var resolve = require('../lib/resolve');

var fixturesDir = path.join(__dirname, 'fixtures');

suite('resolve', function() {
  
 test('./foo', function() {
   var f = resolve('./b', path.join(fixturesDir, 'a.js'));
   assert.equal(f, path.join(fixturesDir, 'b.js'));
 });

 test('../foo', function() {
   var f = resolve('../b', path.join(fixturesDir, 'test/test.js'));
   assert.equal(f, path.join(fixturesDir, 'b.js'));
 });

 test('/foo', function() {
   var f = resolve(path.join(fixturesDir, 'b'), path.join(fixturesDir, 'test/test.js'));
   assert.equal(f, path.join(fixturesDir, 'b.js'));
 });

 test('./folder/foo', function() {
   var f = resolve('./test/test', path.join(fixturesDir, 'a.js'));
   assert.equal(f, path.join(fixturesDir, 'test/test.js'));
 });

 test('bower', function() {
   var f = resolve('comp1', path.join(fixturesDir, 'a.js'));
   assert.equal(f, path.join(fixturesDir, 'components/comp1/lib/index.js'));
 });

 test('npm', function() {
   var f = resolve('mocha', path.join(fixturesDir, 'a.js'));
   assert.equal(f, path.join(__dirname, '../node_modules/mocha/index.js'));
 });

 suite('invalid', function() {
   
   test('module', function() {
     assert.throws(function() {
       resolve('derp', path.join(fixturesDir, 'a.js'));
     });
   });

   test('./derp', function() {
     assert.throws(function() {
       resolve('./derp', path.join(fixturesDir, 'a.js'));
     });
   });

   test('../derp', function() {
     assert.throws(function() {
       resolve('../derp', path.join(fixturesDir, 'a.js'));
     });
   });

   test('/derp', function() {
     assert.throws(function() {
       resolve('/derp', path.join(fixturesDir, 'a.js'));
     });
   });
 });
 

});
