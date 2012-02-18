var expect = require('chai').expect;
var path = require('path');

var Library = require('../lib/library');
var DepTree = require('../lib/deptree');
var File = require('../lib/file');

var fixtureA = path.join(__dirname, 'fixtures/a.js');
var fixtureB = path.join(__dirname, 'fixtures/b.js');
var fixtureC = path.join(__dirname, 'fixtures/c.js');

describe('Library', function() {
  describe('#constructor', function() {
    it('should require module name and filename', function() {
      expect(function() {
        new Library();
      }).to.throw();
      
      expect(function() {
        new Library('name');
      }).to.throw();
    });
  });
  describe('#init', function() {
    var l;
    beforeEach(function() {
      l = new Library('FixtureA', fixtureA);
    }); 

    it('should set name to property', function() {
      expect(l.name).to.equal('FixtureA');
    });
    
    it('should create a files object', function() {
      expect(l.files).to.exist; 
    });

    it('should create a new dependency tree instance', function() {
      var l = new Library('FixtureA', fixtureA);
      expect(l.depTree).to.exist;
      expect(l.depTree).to.be.an.instanceof(DepTree);
    });

    it('should add file passed in as root', function() {
      expect(l.root).to.be.an.instanceof(File);
      expect(l.files[fixtureA]).to.equal(l.root);
      expect(l.depTree.dependants[fixtureA]).to.exist;
    });
    
    
  });

  describe('#getFile', function() {
    var l;
    beforeEach(function() {
      l = new Library('FixtureA', fixtureA);
    }); 

    it('should get file if already exists', function() {
      var f1 = l.files[fixtureA];
      var f2 = l.getFile(fixtureA);
      expect(f2).to.equal(f1);
    });
    

    it('should add to files if doesn\'t exist', function() {
      var f = l.getFile(fixtureB);
      expect(l.files[fixtureB]).to.equal(f);
    });

    it('should take an optional root param', function() {
      var f = l.getFile(fixtureB, true); //don't wrap file
      expect(f.source).to.not.match(/return exports/);
    });
  });

  describe('#requires', function() {
    var l;
    beforeEach(function() {
      l = new Library('FixtureA', fixtureA);
    }); 

    it('should take two file arguments and add to depTree', function() {
      var f = l.getFile(fixtureA);
      var f2 = l.getFile(fixtureB);
      l.requires(f2, f);
      
      expect(l.depTree.dependants[fixtureB].length).to.equal(1);
      expect(l.depTree.dependants[fixtureA].length).to.equal(0);
    });

    it('should also take one file argument and add to depTree', function() {
      var f = l.getFile(fixtureA);
      l.requires(f);
      expect(l.depTree.dependants[fixtureA].length).to.equal(0);
    });
  });

  describe('#build', function() {

    it('should return wrapped source set to module name', function() {
      var l = new Library('FixtureA', fixtureA);
      var out = l.build();
      expect(out).to.match(/var FixtureA = \(function/);
      expect(out).to.match(/return exports/);
    });
    
    it('should handle all dependencies', function() {
      var l = new Library('FixtureC', fixtureC);
      var out = l.build();
      expect(out).to.match(/var FixtureC = \(function/);
      expect(out).to.match(/var ClassA =/);
      expect(out).to.match(/var ClassB =/);
    });
  });
    

});
