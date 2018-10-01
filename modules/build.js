const fs = require('fs'),
      path = require('path');
const func = require('./func');
const packageDir = path.dirname(__dirname),
      installDir = process.env.INIT_CWD || '.';

const build = {
  copyFonts,
  copyDir,
  copyFile,
  createDir,
  createFile,
};

function copyFonts() {
  const sourceDir = `${packageDir}/fonts`,
        destDir   = `${installDir}/fonts`;
  // console.log(packageDir, installDir);
  build.copyDir(sourceDir, destDir);
}

function copyDir(source, dest) {
  // console.log(source, dest);
  if(!func.isExistDir(dest)) fs.mkdirSync(dest);
  fs.readdir(source, (err, files) => {
    // console.log(files);
    files.forEach(file => {
      if(fs.statSync(`${source}/${file}`).isFile()) {
        build.copyFile(`${source}/${file}`, dest);
      } else if(fs.statSync(`${source}/${file}`).isDirectory()) {
        build.copyDir(`${source}/${file}`, `${dest}/${file}`)
      }
    });
  });
}

function copyFile(source, dest) {
  if(fs.statSync(dest).isDirectory()) dest += `/${path.basename(source)}`;
  // console.log(source, dest);
  fs.readFile(source, 'utf8', (err, data) => {
    if(err) throw err;
    fs.writeFile(dest, data, err => {
      if(err) throw err;
    });
  });
}

function createDir(dirpath) {
  try {
    fs.statSync(dirpath);
    return;
  } catch(err) {}
  func.prepareStorage(dirpath);
  fs.mkdir(dirpath, err => {
    if(err) throw err;
  });
}

function createFile(filepath) {
  try {
    fs.statSync(filepath);
    return;
  } catch(err) {}
  func.prepareStorage(filepath);
  fs.writeFile(filepath, '', err => {
    if(err) throw err;
  });
}

module.exports = build;
