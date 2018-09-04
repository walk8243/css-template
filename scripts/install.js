const build = require('../modules/build');
const installDir = process.env.INIT_CWD || '.';

try {
  build.copyFonts();
  build.createFile(`${installDir}/sass/style.scss`);
  build.createDir(`${installDir}/public`);
} catch(error) {
  console.error(error);
}
