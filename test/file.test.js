var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');

var File = require('../lib/file');
var Library = require('../lib/library');

var fixtureA = path.join(__dirname, 'fixtures/a.js');
var fixtureB = path.join(__dirname, 'fixtures/b.js');
var fixtureC = path.join(__dirname, 'fixtures/c.js');

describe('File', function() {

  describe('#init', function() {
    it('should throw if library not passed in', function() {
      var l = new Library();
      expect(function() {
        new File();
      }).to.throw();
    });
    
    it('should set default options', function() {
      var f = new File(l);
      expect(f.options).to.exist;
      expect(f.options.prefix).to.equal('cs');
    });

    it('should take a file param', function() {
      var f = new File(l, fixtureA);
      expect(f.filename).to.equal(fixtureA);
      expect(f.dirname).to.equal(path.dirname(fixtureA));
      expect(f.source).to.exist;
    });
    
    it('should set override options if passed in', function() {
      var opt = { 'prefix': 'duuder' };
      var f = new File(l, opt);
      expect(f.options).to.exist;
      expect(f.options.prefix).to.equal('duuder');
    });

    it('should take both file and options', function() {
      var opt = { 'prefix': 'duuder' };
      var f = new File(l, fixtureA, opt);
      expect(f.filename).to.equal(fixtureA);
      expect(f.options.prefix).to.equal('duuder');
    });

    it('should generate unique id', function() {
      var f = new File(l);
      expect(f.id).to.exist;
    });

  });

  describe('#_getId', function() {
    it('should generate a unique id per instance', function() {
      var f1 = new File(fixtureA);
      var f2 = new File(fixtureA);
      expect(f1.id).to.not.equal(f2.id);
    });
    it('should use prefix to generate id', function() {
      var f = new File(fixtureA, { 
        prefix: 'woot'
      });
      expect(f.id).to.match(/^woot/);
    });
  });

  describe('#setSource', function() {
    var src = 'var a = 1;';
    var f;
    beforeEach(function() {
      var l = new Library();
      f = new File(l);
      f.setSource(src);
    });

    it('should set source prop', function() {
      expect(f.source).to.equal(src);
    });
    it('should set dirname', function() {
      expect(f.dirname).to.exist;
    });
  });

  describe('#resolveRequire', function() {
    var f;
    beforeEach(function() {
      var l = new Library();
      f = new File(l, fixtureA);
    });
    it('should work with module names', function() {
      var p = f.resolveRequire('mocha');
      expect(p).to.match(/node_modules\/mocha\/index.js$/);
    });
    it('should work with relative paths', function() {
      var p = f.resolveRequire('./b'); 
      expect(p).to.match(/test\/fixtures\/b.js$/);
      p = f.resolveRequire('../file.test.js'); 
      expect(p).to.match(/test\/file.test.js$/);
      p = f.resolveRequire('./test/test.js'); 
      expect(p).to.match(/test\/fixtures\/test\/test.js$/);
    });
  });

  describe('#parse', function() {
    var f;
    beforeEach(function() {
      var l = new Library();
      f = new File(l, fixtureC);
      f.parse();
    });
    describe('replace requires', function() {
      it('should replace requires', function() {
        expect(f.source).to.not.match(/requires\(/);
      });
      it('should add dependencies', function() {
        expect(f.library.depTree.dependants[f.filename].length).to.equal(2);
        //expect(f.depTree.dependants
      });
      
    });
    /*
    it('should add dependencies', function() {
      expect(f.deps.length).to.not.equal(0);
    });
    it('should replace module.exports with exports', function() {
      expect(f.src).to.not.match(/module.exports/);
      expect(f.src).to.match(/exports = /);
    });
    console.log(f.src);
    */
  });

  /*
  describe('#wrap', function() {
    it('should wrap code', function() {
      var f = new File(fixtureA);
      f.wrap();
      //TODO
      //expect(f.src).to.match(new RegExp('^var '+f.id+' = \(function\(\) \{'));
      //expect(f.src).to.match(/}\)\(\);$/);
    });
  });

  describe('#replaceRequires', function() {
    var f = new File(fixtureC);
    f.replaceRequires();
    //console.log(f.src);
  });

  describe('#replaceModuleExports', function() {
    var f = new File(fixtureC);
    f.replaceModuleExports();
    //console.log(f.src);
  });

  /*
  */

  describe('#processDependencies', function() {
    
  });
});
