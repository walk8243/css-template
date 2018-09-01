const fs = require('fs'),
      sass = require('node-sass');

module.exports = (src = './sass/style.scss', dest = './public/style.css') => {
  var data = '@import "import";\n\n' + fs.readFileSync(src);
  // console.log(data);
  return new Promise((resolve, reject) => {
    sass.render({
      data: data,
      includePaths: [`${__dirname}/sass`]
    }, (error, result) => {
      if(error) return reject(error);
      fs.writeFile(dest, result.css.toString(), err => {
        if(err) return reject(err);
        // console.log('The file has been saved!');
        resolve();
      });
    });
  });
};
