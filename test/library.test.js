var expect = require('chai').expect;
var path = require('path');

var Library = require('../lib/library');
var DepTree = require('../lib/deptree');
var File = require('../lib/file');

var fixtureA = path.join(__dirname, 'fixtures/a.js');
var fixtureB = path.join(__dirname, 'fixtures/b.js');
var fixtureC = path.join(__dirname, 'fixtures/c.js');

describe('Library', function() {
  describe('#init', function() {
    var l;
    beforeEach(function() {
      l = new Library();
    });
    it('should create a blank files object', function() {
      expect(l.files).to.exist; 
    });
    it('should create a new dependency tree instance', function() {
      expect(l.depTree).to.exist;
      expect(l.depTree).to.be.an.instanceof(DepTree);
    });
    it('should take an optional file', function() {
      var l = new Library(fixtureA); 
      expect(l.files[fixtureA]).to.exist;

    });
    
  });

  /*
  describe('#requires', function() {
    var l;
    beforeEach(function() {
      l = new Library();
      l.requires(fixtureC, fixtureA);
    });
    it('should add to files object', function() {
      expect(l.files[fixtureA]).to.be.an.instanceof(File);
    });
    
  });
  */

  describe('#build', function() {
    it('should do stuff', function() {
      var l = new Library(fixtureC);
      var out = l.build();
      
    });
    
  });
    

});
