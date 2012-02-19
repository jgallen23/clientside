var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');

var File = require('../lib/file');

var fixtureA = path.join(__dirname, 'fixtures/a.js');
var fixtureB = path.join(__dirname, 'fixtures/b.js');
var fixtureC = path.join(__dirname, 'fixtures/c.js');

describe('File', function() {
  describe('#init', function() {

    it('should set default options', function() {
      var f = new File();
      expect(f.options).to.exist;
      expect(f.options.prefix).to.equal('cs');
    });

    it('should take a file param', function() {
      var f = new File(fixtureA);
      expect(f.filename).to.equal(fixtureA);
      expect(f.dirname).to.equal(path.dirname(fixtureA));
      expect(f.source).to.equal(fs.readFileSync(fixtureA, 'utf8'));
    });
    
    it('should set override options if passed in', function() {
      var opt = { 'prefix': 'duuder' };
      var f = new File(opt);
      expect(f.options).to.exist;
      expect(f.options.prefix).to.equal('duuder');
    });

    it('should take both file and options', function() {
      var opt = { 'prefix': 'duuder' };
      var f = new File(fixtureA, opt);
      expect(f.filename).to.equal(fixtureA);
      expect(f.options.prefix).to.equal('duuder');
    });

    it('should generate unique id', function() {
      var f = new File();
      expect(f.id).to.exist;
    });

  });

  describe('#generateId', function() {
    it('should only generateId once per file', function() {
      var f1 = new File(fixtureA);
      var id1 = f1.id;
      expect(f1.generateId()).to.equal(id1);
    });
    
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
      f = new File();
      f.setSource(src);
    });

    it('should set source prop', function() {
      expect(f.source).to.equal(src);
    });
    it('should set dirname', function() {
      expect(f.dirname).to.exist;
    });
  });

  describe('#replace', function() {
    it('should replace all instances in the source', function() {
      var f = new File(fixtureA);
      f.replace('ClassA', 'ClassD');
      expect(f.source).to.not.match(/ClassA/);
      expect(f.source).to.match(/ClassD/);
    });
  });

  describe('#replaceModuleExports', function() {
    it('should replace module.exports with exports', function() {
      var f = new File(fixtureC);
      f.replaceModuleExports();
      expect(f.source).to.not.match(/module.exports/);  
      expect(f.source).to.match(/exports/);  
    });
  });

  describe('#replaceRequires', function() {
    it('should replace require() with variable', function() {
      var f = new File(fixtureC);
      f.replaceRequire('./a', 'replaceRequiresVar');
      expect(f.source).to.not.match(/\.\/a/);
      expect(f.source).to.match(/replaceRequiresVar/);
    });
  });

  describe('#findDependencies', function() {
    it('should return all dependencies for the file', function() {
      var f = new File(fixtureC);
      var deps = f.findDependencies();
      expect(deps.length).to.equal(2);
      expect(deps[0]).to.equal('./a');
    });
  });

  describe('#wrap', function() {
    it('should wrap code', function() {
      var f = new File(fixtureA);
      f.wrap();
      expect(f.source).to.match(new RegExp('^var '+f.id+' = '));
      expect(f.source).to.match(/return exports;/);
    });
  });

  describe('#build', function() {
    it('should replaceRequires, replace module.exports', function() {
      var f = new File(fixtureC);
      var out = f.build();
      expect(out).to.not.match(/requires/);
      expect(out).to.not.match(/module.exports/);  
    });
  });

  //TODO:
  /*
  describe('#parse', function() {
    var f;
    beforeEach(function() {
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
    it('should add dependencies', function() {
      expect(f.deps.length).to.not.equal(0);
    });
    it('should replace module.exports with exports', function() {
      expect(f.src).to.not.match(/module.exports/);
      expect(f.src).to.match(/exports = /);
    });
    console.log(f.src);
  });
  */
});
