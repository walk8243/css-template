const CleanCSS  = require('clean-css'),
      fs        = require('fs'),
      sass      = require('node-sass');
const func      = require('./modules/func');


module.exports = (src = './sass/style.scss', dest = './public/style.css') => {
  return new Promise((resolve, reject) => {
    if(!func.isExistFile(src)) return reject(new Error(`'${src}'が存在しないか、ファイルではありません。`));
    sass.render({
      data: '@import "import";\n\n' + fs.readFileSync(src),
      includePaths: [`${__dirname}/sass`],
      outputStyle: 'expanded'
    }, (error, result) => {
      if(error) return reject(error);
      func.prepareStorage(dest);
      var minimized = new CleanCSS().minify(result.css.toString()).styles;
      fs.writeFile(dest, minimized, err => {
        if(err) return reject(err);
        resolve();
      });
    });
  });
};
