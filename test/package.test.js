var expect = require('chai').expect;
var path = require('path');

var packageReader = require('../lib/package-reader');
var Library = require('../lib/library');
var File = require('../lib/file');
var fixtureA = path.join(__dirname, 'fixtures/a.js');
var fixtureAShim = path.join(__dirname, 'fixtures/shim-a.js');
var fixtureB = path.join(__dirname, 'fixtures/b.js');


describe('packageReader', function() {
  var l;
  describe('fixture/package', function() {
    var packageFixture = path.join(__dirname, 'fixtures/package.json');
    var json = require(packageFixture);
    
    beforeEach(function() {
      l = packageReader(json);
    });
    it('should return library instance', function() {
      expect(l).to.be.an.instanceof(Library);
    });
    it('should set name from json', function() {
      expect(l.meta.name).to.equal(json.name);
    });
    it('should set main from json', function() {
      expect(l.meta.main).to.equal(fixtureA);
    });
    it('should set shims if they exist', function() {
      expect(l.meta.shim).to.eql({});
    });
  });
  
  describe('fixture/packagec', function() {
    var packageFixture = path.join(__dirname, 'fixtures/packageb.json');
    var json = require(packageFixture);
    
    beforeEach(function() {
      l = packageReader(json);
    });
    it('should set name from clientside object', function() {
      expect(l.meta.name).to.equal(json.clientside.name);
    });
    it('should set main from clientside object', function() {
      expect(l.meta.main).to.equal(fixtureB);
    });
    it('should set shims if they exist', function() {
      expect(l.meta.files[fixtureA]).to.be.instanceof(File);
      expect(l.meta.files[fixtureA].filename).to.equal(fixtureAShim);
    });
    it('should build correctly', function() {
      var out = l.build();
      expect(out).to.match(/ClassA shim init/);
    });
  });
});
