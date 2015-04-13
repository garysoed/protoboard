var path = require('path');

function read(file) {
  var json = require(file);
  var base;
  if (json.base) {
    var basePath = file[0] === '/'
        ? path.join(path.dirname(file), json.base)
        : path.join(__dirname, path.dirname(file), json.base);
    base = read(basePath);
  } else {
    base = {};
  }
  for (var key in json.vars) {
    base[key] = json.vars[key];
  }
  return base;
}

module.exports = read;