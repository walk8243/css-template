const fs        = require('fs'),
      path      = require('path');

const func = {
  isExistFile,
  isExistDir,
  prepareStorage,
};

function isExistFile(filename) {
  try {
    var stats = fs.statSync(filename);
    if(stats.isFile()) return true;
  } catch(error) {}
  return false;
}
function isExistDir(dirname) {
  try {
    var stats = fs.statSync(dirname);
    if(stats.isDirectory()) return true;
  } catch(error) {}
  return false;
}
function prepareStorage(pathname) {
  var parentDir = path.dirname(pathname);
  if(!func.isExistDir(parentDir)) {
    if(func.prepareStorage(parentDir)) {
      fs.mkdirSync(parentDir);
    }
  }
  return true;
}

module.exports = func;
