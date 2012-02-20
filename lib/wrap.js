module.exports = function(variableName, source, returns) {
  if (!returns) returns = 'exports';
  var start = 'var '+variableName+' = (function(exports) {\n';
  var end = '\nreturn '+returns+';\n})({});';
  return start + source + end;
};
