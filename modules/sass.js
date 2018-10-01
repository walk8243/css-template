const CleanCSS  = require('clean-css'),
      fs        = require('fs'),
      nodeSass  = require('node-sass'),
      path      = require('path');
const func      = require('./func');

const moduleDir = path.dirname(__dirname);

const sass = {
  render,
  writeFile,
};

async function render(src) {
  if(!func.isExistFile(src)) throw new Error(`'${src}'が存在しないか、ファイルではありません。`);
  var result = nodeSass.renderSync({
    data: '@import "import";\n\n' + fs.readFileSync(src),
    includePaths: [`${moduleDir}/sass`],
    outputStyle: 'expanded'
  });

  return result;
}
function writeFile(css, dest) {
  return new Promise((resolve, reject) => {
    func.prepareStorage(dest);
    var minimized = new CleanCSS().minify(css).styles;
    fs.writeFile(dest, minimized, error => {
      if(error) return reject(error);
      resolve();
    });
  });
}

module.exports = sass;
