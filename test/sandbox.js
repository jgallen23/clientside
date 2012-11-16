var vm = require('vm');

//helper to run clientside in a sandbox
var run = function(results, done) {
  var sandbox = {
    window: {
      document: {
        addEventListener: function(){}
      }
    },
    document: {
      addEventListener: function() {}
    },
    navigator: {},
    __cs: undefined,
    name: undefined,
    console: {
      log: function() {}
    }
  };

  //console.log(results);
  vm.runInNewContext(results, sandbox);
  var out = sandbox;
  //console.log(out);
  return out;
};

module.exports = run;
