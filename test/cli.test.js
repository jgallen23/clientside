var assert = require('assert');

var exec = require('child_process').exec;
var fs = require('fs');

var cmd = 'node bin/clientside.js';

suite('cli', function() {

  test('clientside no arguments', function(done) {
    exec(cmd, function(err, stdout, stderr) {
      assert.notEqual(err, null);
      assert.ok(stderr.match(/Missing required arguments: m/));
      done();
    });
  });

  test('clientside -m', function(done) {
    exec(cmd + ' -m test/fixtures/c.js', function(err, stdout, stderr) {
      assert.equal(err, null);
      assert.ok(stdout, fs.readFileSync('test/fixtures/out.js', 'utf8'));
      done();
    });
  });
  
  test('clientside -m -n', function(done) {
    exec(cmd + ' -m test/fixtures/c.js -n name', function(err, stdout, stderr) {
      assert.equal(err, null);
      assert.ok(stdout, fs.readFileSync('test/fixtures/out.js', 'utf8'));
      done();
    });
  });
});

