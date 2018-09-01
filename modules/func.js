const fs        = require('fs'),
      path      = require('path');

const isExistFile = (filename) => {
        try {
          var stats = fs.statSync(filename);
          if(stats.isFile()) return true;
        } catch(error) {}
        return false;
      },
      isExistDir  = (dirname) => {
        try {
          var stats = fs.statSync(dirname);
          if(stats.isDirectory()) return true;
        } catch(error) {}
        return false;
      },
      prepareStorage  = (pathname) => {
        var parentDir = path.dirname(pathname);
        if(!isExistDir(parentDir)) {
          if(prepareStorage(parentDir)) {
            fs.mkdirSync(parentDir);
          }
        }
        return true;
      };


module.exports = func = {
  isExistFile,
  isExistDir,
  prepareStorage,
};
