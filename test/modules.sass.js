const assert    = require('assert'),
      CleanCSS  = require('clean-css'),
      fs        = require('fs'),
      nodeSass  = require('node-sass'),
      path      = require('path'),
      sinon     = require('sinon');
const func      = require('../modules/func'),
      sass      = require('../modules/sass');

describe('Sass Module', () => {
  it('Moduleの内容確認', () => {
    assert.deepEqual(Object.keys(sass), ['render', 'writeFile']);
    assert.equal(typeof sass.render, 'function');
    assert.equal(typeof sass.writeFile, 'function');
  });

  describe('render', () => {
    var stubFuncIsExistFile,
        stubNodeSassRenderSync,
        stubFsReadFileSync;
    const srcSass = './sass/style.scss',
          destSass = './public/style.css';
    before(() => {
      stubFuncIsExistFile = sinon.stub(func, 'isExistFile');
      stubNodeSassRenderSync = sinon.stub(nodeSass, 'renderSync');
      stubFsReadFileSync = sinon.stub(fs, 'readFileSync');
    });
    after(() => {
      stubFuncIsExistFile.restore();
      stubNodeSassRenderSync.restore();
      stubFsReadFileSync.restore();
    });
    beforeEach(() => {
      stubFuncIsExistFile.returns(true);
      stubNodeSassRenderSync.resolves('fuga');
      stubFsReadFileSync.returns('hoge')
    });
    afterEach(() => {
      stubFuncIsExistFile.reset();
      stubNodeSassRenderSync.reset();
      stubFsReadFileSync.reset();
    });

    describe('render', () => {
      it('正常系', async () => {
        try {
          var result = await sass.render(srcSass);
          assert.equal(result, 'fuga');
          assert.ok(stubFuncIsExistFile.calledOnce);
          assert.ok(stubNodeSassRenderSync.calledOnce);
          assert.ok(stubFsReadFileSync.calledOnce);
          assert.equal(stubFuncIsExistFile.getCall(0).args[0], srcSass);
          assert.deepEqual(
            stubNodeSassRenderSync.getCall(0).args[0],
            {
              data: '@import "import";\n\n' + fs.readFileSync(srcSass),
              includePaths: [`${path.dirname(__dirname)}/sass`],
              outputStyle: 'expanded'
            }
          );
          assert.equal(stubFsReadFileSync.getCall(0).args[0], srcSass);
        } catch(error) {done(error);}
      });

      describe('異常系', () => {
        it('isExistFile Error', async () => {
          stubFuncIsExistFile.returns(false);
          try {
            await sass.render(srcSass);
            assert.fail();
          } catch(error) {
            assert.equal(error.name, 'Error');
            assert.equal(error.message, `'${srcSass}'が存在しないか、ファイルではありません。`);
          }
        });
        it('renderSync Error', async () => {
          stubNodeSassRenderSync.rejects();
          try {
            await sass.render(srcSass);
            assert.fail();
          } catch(error) {
            assert.equal(error.name, 'Error');
          }
        });
        it('renderSync Error', async () => {
          stubFsReadFileSync.throws();
          try {
            await sass.render(srcSass);
            assert.fail();
          } catch(error) {
            assert.equal(error.name, 'Error');
          }
        });
      });
    });
  });

  describe('writeFile', () => {
    var stubFuncPrepareStorage,
        stubCleanCSSMinify,
        stubFsWriteFile;
    const cssString = 'html *{color:#333;}',
          destSass = './public/style.css';
    before(() => {
      stubFuncPrepareStorage = sinon.stub(func, 'prepareStorage');
      stubCleanCSSMinify = sinon.stub(CleanCSS.prototype, 'minify');
      stubFsWriteFile = sinon.stub(fs, 'writeFile');
    });
    after(() => {
      stubFuncPrepareStorage.restore();
      stubCleanCSSMinify.restore();
      stubFsWriteFile.restore();
    });
    beforeEach(() => {
      stubFuncPrepareStorage.returns();
      stubCleanCSSMinify.returns({styles: 'aaa'});
      stubFsWriteFile.callsArgOn(2, () => resolve());
    });
    afterEach(() => {
      stubFuncPrepareStorage.reset();
      stubCleanCSSMinify.reset();
      stubFsWriteFile.reset();
    });

    it('正常系', done => {
      sass.writeFile(cssString, destSass)
        .then(() => {
          assert.ok(stubFuncPrepareStorage.calledOnce);
          assert.ok(stubCleanCSSMinify.calledOnce);
          assert.ok(stubFsWriteFile.calledOnce);
          assert.equal(stubFuncPrepareStorage.getCall(0).args[0], destSass);
          assert.equal(stubCleanCSSMinify.getCall(0).args[0], cssString);
          assert.equal(stubFsWriteFile.getCall(0).args[0], destSass);
          assert.equal(stubFsWriteFile.getCall(0).args[1], 'aaa');
          done();
        });
    });
    describe('異常系', () => {
      it('prepareStorage Error', done => {
        stubFuncPrepareStorage.throws();
        sass.writeFile(cssString, destSass)
          .catch(error => {
            assert.equal(error.name, 'Error');
            assert.equal(error.message, 'Error');
            assert.ok(stubFuncPrepareStorage.calledOnce);
            assert.ok(stubCleanCSSMinify.notCalled);
            assert.ok(stubFsWriteFile.notCalled);
            done();
          });
      });
      it('CleanCSS minify Error', done => {
        stubCleanCSSMinify.throws();
        sass.writeFile(cssString, destSass)
          .catch(error => {
            assert.equal(error.name, 'Error');
            assert.equal(error.message, 'Error');
            assert.ok(stubFuncPrepareStorage.calledOnce);
            assert.ok(stubCleanCSSMinify.calledOnce);
            assert.ok(stubFsWriteFile.notCalled);
            done();
          });
      });
      it('writeFile Error', done => {
        stubFsWriteFile.callsArgOnWith(2, error => reject(), new Error());
        sass.writeFile(cssString, destSass)
          .catch(error => {
            assert.equal(error.name, 'Error');
            assert.ok(stubFuncPrepareStorage.calledOnce);
            assert.ok(stubCleanCSSMinify.calledOnce);
            assert.ok(stubFsWriteFile.calledOnce);
            done();
          });
      });
    });
  });
});
