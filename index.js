const CleanCSS  = require('clean-css'),
      fs        = require('fs'),
      sass      = require('node-sass');

const isExistFile = (filename) => {
        try {
          var stats = fs.statSync(filename);
          if(stats.isFile()) return true;
        } catch(error) {}
        return false;
      };


module.exports = (src = './sass/style.scss', dest = './public/style.css') => {
  return new Promise((resolve, reject) => {
    if(!isExistFile(src)) return reject(new Error(`'${src}'が存在しないか、ファイルではありません。`));
    sass.render({
      data: '@import "import";\n\n' + fs.readFileSync(src),
      includePaths: [`${__dirname}/sass`],
      outputStyle: 'expanded'
    }, (error, result) => {
      if(error) return reject(error);
      var minimized = new CleanCSS().minify(result.css.toString()).styles;
      fs.writeFile(dest, minimized, err => {
        if(err) return reject(err);
        resolve();
      });
    });
  });
};
