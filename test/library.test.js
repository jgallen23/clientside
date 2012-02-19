var expect = require('chai').expect;
var path = require('path');
var vm = require('vm');

var Library = require('../lib/library');
var DepTree = require('../lib/deptree');
var File = require('../lib/file');

var fixtureA = path.join(__dirname, 'fixtures/a.js');
var fixtureAShim = path.join(__dirname, 'fixtures/shim-a.js');
var fixtureB = path.join(__dirname, 'fixtures/b.js');
var fixtureC = path.join(__dirname, 'fixtures/c.js');

describe('Library', function() {
  describe('#init', function() {

    it('should set defaults', function() {
      var lib = new Library();
      expect(lib.meta.name).to.equal('moduleName');
    });

    it('should be able to override defaults', function() {
      var lib = new Library({ name: 'awesomeSause'});
      expect(lib.meta.name).to.equal('awesomeSause');
    });

    it('should allow relative path for main', function() {
      var lib = new Library({ main: 'test/fixtures/a.js' });
      expect(lib.meta.main).to.equal(fixtureA);
    });

    it('should check if main file exists', function() {
      expect(function() {
        new Library({ main: 'fail.js'});
      }).to.throw();
    });

    it('should set dirname from main file', function() {
      var lib = new Library({ main: fixtureA, name: 'awesomeSause'});
      expect(lib.dirname).to.exist;
    });

    it('should set dirname to cwd if no main file', function() {
      var lib = new Library();
      expect(lib.dirname).to.exist;
    });

    it('should create a new dependency tree instance', function() {
      var lib = new Library();
      expect(lib.depTree).to.exist;
      expect(lib.depTree).to.be.an.instanceof(DepTree);
    });

  });

  describe('#addFile', function() {
    var lib;
    beforeEach(function() {
      lib = new Library({
        main: fixtureB
      });
      //addFile called if main defined
    });

    it('should add file to meta.files', function() {
      expect(lib.meta.files[fixtureB]).to.be.instanceof(File);
    });

    it('should call addDependencies', function() {
      expect(lib.depTree.dependants[fixtureB].length).to.equal(1);
    });

    it('should check if file exists', function() {
      
    });

    it('should take optional key param', function() {
      lib.addFile(fixtureAShim, fixtureC);
      expect(lib.meta.files[fixtureC]).to.exist; 
    });
    
  });

  //called automatically if shims inside config object
  describe('#processShims', function() {
    it('should add shim to files', function() {
      var lib = new Library({
        main: fixtureB,
        shim: {
          './a': fixtureAShim,
          'fs': fixtureAShim
        }
      });
      expect(lib.meta.files[fixtureA].filename).to.equal(fixtureAShim);
    });
  });


  describe('#build', function() {
    it('should get list of dependencies and return source', function() {
      var lib = new Library({ main: fixtureB });
      var out = lib.build();
      
      var sandbox = {
        console: {
          log: function() {} 
        }
      };
      expect(out).to.not.match(/require/);
      expect(out).to.not.match(/module.exports/);
      expect(function() {
        vm.runInNewContext(out, sandbox);
      }).to.not.throw();
    });
    it('should build with shims', function() {
      var lib = new Library({ 
        main: fixtureB,
        shim: {
          './a': fixtureAShim
        }
      });
      var out = lib.build();
      //console.log(out);
      
      var sandbox = {
        console: {
          log: function() {} 
        }
      };
      expect(out).to.match(/ClassA shim init/);
      expect(function() {
        vm.runInNewContext(out, sandbox);
      }).to.not.throw();
    });
  });
});
