const CleanCSS  = require('clean-css'),
      fs        = require('fs'),
      sass      = require('node-sass');

module.exports = (src = './sass/style.scss', dest = './public/style.css') => {
  return new Promise((resolve, reject) => {
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
