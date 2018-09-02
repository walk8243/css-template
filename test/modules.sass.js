const assert    = require('assert'),
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
});
