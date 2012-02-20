module.exports = function(variableName, source, returns) {
  if (!returns) returns = 'exports';
  var start = 'var '+variableName+' = (function(exports, module) {\n';
  var end = '\nreturn '+returns+';\n})({}, true);';
  return start + source + end;
};
