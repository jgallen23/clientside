var assert = require('assert');

var exec = require('child_process').exec;
var fs = require('fs');

var cmd = 'node bin/clientside.js';

suite('cli', function() {

  test('no arguments', function(done) {
    exec(cmd, function(err, stdout, stderr) {
      assert.ok(stderr.match(/Error: must pass in a file/));
      done();
    });
  });

  test('file', function(done) {
    exec(cmd + ' test/fixtures/c.js', function(err, stdout, stderr) {
      assert.equal(err, null);
      assert.ok(stdout, fs.readFileSync('test/fixtures/out.js', 'utf8'));
      assert.equal(stdout.match(/__cs.libs.cs/g).length, 3); //3 libraries
      done();
    });
  });
  
  test('file with name', function(done) {
    exec(cmd + ' test/fixtures/c.js -n name', function(err, stdout, stderr) {
      assert.equal(err, null);
      assert.ok(stdout, fs.readFileSync('test/fixtures/out.js', 'utf8'));
      done();
    });
  });

  test('file that doesnt exist', function(done) {
    exec(cmd + ' test/fixtures/bad-file.js', function(err, stdout, stderr) {
      assert.notEqual(err, null);
      done();
    });
  });

  test('dep that doesnt exist', function(done) {
    exec(cmd + ' test/fixtures/invalid-dep.js', function(err, stdout, stderr) {
      assert.notEqual(err, null);
      done();
    });
  });

  test('exclude', function(done) {
    exec(cmd + ' test/fixtures/b.js --exclude ./a', function(err, stdout, stderr) {
      assert.equal(stdout.match(/__cs.libs.cs/g).length, 1);
      assert.equal(stdout.match(/a.js/), null);
      done();
    });
  });

  test('exclude multiple', function(done) {
    exec(cmd + ' test/fixtures/c.js --exclude ./a --exclude ./b', function(err, stdout, stderr) {
      assert.equal(stdout.match(/__cs.libs.cs/g).length, 1);
      assert.equal(stdout.match(/a.js/), null);
      assert.equal(stdout.match(/b.js/), null);
      done();
    });
  });

  test('-h', function(done) {
    exec(cmd + ' -h', function(err, stdout, stderr) {
      assert.equal(err, null);
      assert.ok(stdout.match(/clientside \d.\d.\d\nUsage: /));
      done();
    });
  });

  test('--help', function(done) {
    exec(cmd + ' --help', function(err, stdout, stderr) {
      assert.equal(err, null);
      assert.ok(stdout.match(/clientside \d.\d.\d\nUsage: /));
      done();
    });
  });
});
