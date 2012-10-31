var assert = require('assert');

var exec = require('child_process').exec;
var fs = require('fs');

var cmd = 'node bin/clientside.js';

suite('cli', function() {

  test('clientside no arguments', function(done) {
    exec(cmd, function(err, stdout, stderr) {
      assert.ok(stderr.match(/Error: must pass in a file/));
      done();
    });
  });

  test('clientside <file.js>', function(done) {
    exec(cmd + ' test/fixtures/c.js', function(err, stdout, stderr) {
      assert.equal(err, null);
      assert.ok(stdout, fs.readFileSync('test/fixtures/out.js', 'utf8'));
      done();
    });
  });
  
  test('clientside <file.js> -n', function(done) {
    exec(cmd + ' test/fixtures/c.js -n name', function(err, stdout, stderr) {
      assert.equal(err, null);
      assert.ok(stdout, fs.readFileSync('test/fixtures/out.js', 'utf8'));
      done();
    });
  });

  test('clientside -h', function(done) {
    exec(cmd + ' -h', function(err, stdout, stderr) {
      assert.equal(err, null);
      assert.ok(stdout.match(/clientside \d.\d.\d\nUsage: /));
      done();
    });
  });
  test('clientside --help', function(done) {
    exec(cmd + ' --help', function(err, stdout, stderr) {
      assert.equal(err, null);
      assert.ok(stdout.match(/clientside \d.\d.\d\nUsage: /));
      done();
    });
  });
});
