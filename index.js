const sass      = require('./modules/sass');

module.exports = async (src = './sass/style.scss', dest = './public/style.css') => {
  try {
    var result = await sass.render(src);
    await sass.writeFile(result.css.toString(), dest);
    return;
  } catch(error) {
    throw error;
  }
};
