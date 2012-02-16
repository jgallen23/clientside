var expect = require('chai').expect;
var DepTree = require('../lib/deptree');

describe('DepTree', function() {

  describe('#init', function() {
    it('should create dependants property', function() {
      var dep = new DepTree();
      expect(dep.dependants).to.exist;
    });
        
  });

  describe('#add', function() {
    it('should take in one string', function() {
      var dep = new DepTree();
      dep.add('test1');

      expect(dep.dependants.test1).to.exist;
      expect(dep.dependants.test1).to.be.an.instanceof(Array);
      expect(dep.dependants.test1.length).to.equal(0);
    });
    it('should take in two strings', function() {
      var dep = new DepTree();
      dep.add('test1', 'test2');

      expect(dep.dependants.test1).to.be.an.instanceof(Array);
      expect(dep.dependants.test1.length).to.equal(1);
      expect(dep.dependants.test1).to.eql(['test2']);
      expect(dep.dependants.test2).to.be.an.instanceof(Array);
      expect(dep.dependants.test2.length).to.equal(0);

    }); 

    it('should take in an array for deps', function() {
      var dep = new DepTree();
      dep.add('test1', ['test2', 'test3']);

      expect(dep.dependants.test1).to.be.an.instanceof(Array);
      expect(dep.dependants.test1.length).to.equal(2);
      expect(dep.dependants.test1).to.eql(['test2', 'test3']);
      expect(dep.dependants.test2).to.be.an.instanceof(Array);
      expect(dep.dependants.test2.length).to.equal(0);
      expect(dep.dependants.test3).to.be.an.instanceof(Array);
      expect(dep.dependants.test3.length).to.equal(0);

    }); 
    it('should check for circular deps', function() {
      var dep = new DepTree();
      dep.add('test1', 'test2');
      expect(function() {
        dep.add('test2', 'test1');
      }).to.throw();
    });
    it('should not overwrite existing', function() {
      var dep = new DepTree();
      dep.add('test2', 'test3');
      dep.add('test1', 'test2');

      expect(dep.dependants.test1).to.be.an.instanceof(Array);
      expect(dep.dependants.test1.length).to.equal(1);
      expect(dep.dependants.test1).to.eql(['test2']);
      expect(dep.dependants.test2).to.be.an.instanceof(Array);
      expect(dep.dependants.test2.length).to.equal(1);
      expect(dep.dependants.test2).to.eql(['test3']);
    }); 
    it('should not overwrite existing (complex)', function() {
      var dep = new DepTree();
      dep.add('test2', 'test3');
      dep.add('test1', ['test2', 'test3']);

      expect(dep.dependants.test1).to.be.an.instanceof(Array);
      expect(dep.dependants.test1.length).to.equal(2);
      expect(dep.dependants.test1).to.eql(['test2', 'test3']);
      expect(dep.dependants.test2).to.be.an.instanceof(Array);
      expect(dep.dependants.test2.length).to.equal(1);
      expect(dep.dependants.test2).to.eql(['test3']);

    }); 

    it('should not add duplicates', function() {
      var dep = new DepTree();
      dep.add('test2', 'test3');
      dep.add('test2', ['test3', 'test4']);

      expect(dep.dependants.test2).to.eql(['test3', 'test4']);

    });
    it('should append to existing dependencies', function() {
      var dep = new DepTree();
      dep.add('test2', 'test3');
      dep.add('test3', 'test6');
      dep.add('test3', ['test4', 'test5']);

      expect(dep.dependants.test3.length).to.equal(3);

      expect(dep.dependants.test3).to.eql(['test6', 'test4', 'test5']);
      expect(dep.dependants.test2.length).to.equal(1);
      expect(dep.dependants.test2).to.eql(['test3']);

    }); 
  });

  describe('#containsAll', function() {
    var dep = new DepTree(); 

    it('should check if every item in list 2 is in list 1', function() {

      expect(dep.containsAll(['test1'], ['test1'])).to.equal(true);
      expect(dep.containsAll(['test1'], ['test2'])).to.equal(false);
      expect(dep.containsAll(['test1', 'test2'], ['test2'])).to.equal(true);
      expect(dep.containsAll(['test1', 'test2'], ['test1', 'test2'])).to.equal(true);
      expect(dep.containsAll(['test1', 'test2', 'test3'], ['test1', 'test2'])).to.equal(true);
      expect(dep.containsAll(['test1', 'test2'], ['test3', 'test1', 'test2'])).to.equal(false);
      
    });
  });


  describe('#getList', function() {

    it('should calculate basic dependencies', function() {
      var dep = new DepTree();
      dep.add('test1', 'test2');
      var deps = dep.getList();
      expect(deps).to.be.an.instanceof(Array);
      expect(deps.length).to.equal(2);
      expect(deps[0]).to.equal('test2');
      expect(deps[1]).to.equal('test1');
    });
    it('should calculate multiple dependencies', function() {
      var dep = new DepTree();
      dep.add('test1', ['test2', 'test3']);
      var deps = dep.getList();
      expect(deps.length).to.equal(3);
      expect(deps[0]).to.equal('test2');
      expect(deps[1]).to.equal('test3');
      expect(deps[2]).to.equal('test1');
    });
    it('should calculate nested dependencies', function() {
      var dep = new DepTree();
      dep.add('test1', 'test2');
      dep.add('test2', ['test3', 'test4']);
      var deps = dep.getList();
      expect(deps).to.eql(['test3', 'test4', 'test2', 'test1']);
    });
    
  });
});
