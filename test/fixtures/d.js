function debug(app) {
  return function(msg) {
    console.log(app + ' ' + msg);
  };
}
