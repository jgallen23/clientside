var DependencyTree = function() {
  this.dependants = {}; 
};

DependencyTree.prototype.add = function(file, dependants) {
  var self = this;
  if (!dependants)
    dependants = [];
  else if (!(dependants instanceof Array)) 
    dependants = [dependants];

  dependants.forEach(function(item, i) {
    //check circular deps
    if (self.dependants[item] && self.dependants[item].indexOf(file) != -1) {
      throw new Error('Cirular Dependencies '+ item + ' ' + file);
    }
    self.add(item);
  });
  
  if (typeof this.dependants[file] == 'undefined')
    this.dependants[file] = [];
  dependants.forEach(function(item, i) {
    if (self.dependants[file].indexOf(item) == -1)
      self.dependants[file].push(item);
  });
};

DependencyTree.prototype.containsAll = function(list1, list2) {
  for (var i = 0, c = list2.length; i < c; i++) {
    if (list1.indexOf(list2[i]) == -1)
      return false;
  }
  return true;
};

DependencyTree.prototype.getList = function() {
  var list = [];
  var max = 0;
  var count = 0;
  var clone = {};
  for (var file in this.dependants) {
    max++;
    clone[file] = this.dependants[file];
  }
  while (max != count) {
    for (var file in clone) {
      var deps = clone[file];
      if (deps.length == 0 || this.containsAll(list, deps)) {
        list.push(file);
        delete clone[file];
        continue;
      }
    }
    count++;
  }
  return list;
};


module.exports = DependencyTree;
