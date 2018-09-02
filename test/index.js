const assert  = require('assert'),
      sinon   = require('sinon');
const cssTemplate = require('../index'),
      sass        = require('../modules/sass');

describe('Module script', () => {
  var stubSassRender,
      stubSassWriteFile;
  const srcSass = './style.scss',
        destSass = './style.css',
        returnSassRenderCss = 'html *{color:#333}',
        returnSassRender = {
          css: Buffer.from(returnSassRenderCss)
        };
  before(() => {
    stubSassRender = sinon.stub(sass, 'render');
    stubSassWriteFile = sinon.stub(sass, 'writeFile');
  });
  after(() => {
    stubSassRender.restore();
    stubSassWriteFile.restore();
  });
  beforeEach(() => {
    stubSassRender.resolves(returnSassRender);
    stubSassWriteFile.resolves();
  });
  afterEach(() => {
    stubSassRender.reset();
    stubSassWriteFile.reset();
  });

  it('関数の存在確認', () => {
    assert.equal(typeof cssTemplate, 'function');
  });
  describe('cssTemplate', () => {
    describe('正常系', () => {
      it('argsなし', done => {
        cssTemplate()
          .then(() => {
            assert.ok(stubSassRender.calledOnce);
            assert.equal(stubSassRender.getCall(0).args[0], './sass/style.scss');
            assert.ok(stubSassWriteFile.calledOnce);
            assert.equal(stubSassWriteFile.getCall(0).args[0], returnSassRenderCss);
            assert.equal(stubSassWriteFile.getCall(0).args[1], './public/style.css');
            done();
          }).catch(done);
      });
      it('argsあり', done => {
        cssTemplate(srcSass, destSass)
          .then(() => {
            assert.ok(stubSassRender.calledOnce);
            assert.equal(stubSassRender.getCall(0).args[0], srcSass);
            assert.ok(stubSassWriteFile.calledOnce);
            assert.equal(stubSassWriteFile.getCall(0).args[0], returnSassRenderCss);
            assert.equal(stubSassWriteFile.getCall(0).args[1], destSass);
            done();
          }).catch(done);
      });
      it('args[0]を設定', done => {
        cssTemplate(srcSass)
          .then(() => {
            assert.ok(stubSassRender.calledOnce);
            assert.equal(stubSassRender.getCall(0).args[0], srcSass);
            assert.ok(stubSassWriteFile.calledOnce);
            assert.equal(stubSassWriteFile.getCall(0).args[0], returnSassRenderCss);
            assert.equal(stubSassWriteFile.getCall(0).args[1], './public/style.css');
            done();
          }).catch(done);
      });
      it('args[1]を設定', done => {
        cssTemplate(undefined, destSass)
          .then(() => {
            assert.ok(stubSassRender.calledOnce);
            assert.equal(stubSassRender.getCall(0).args[0], './sass/style.scss');
            assert.ok(stubSassWriteFile.calledOnce);
            assert.equal(stubSassWriteFile.getCall(0).args[0], returnSassRenderCss);
            assert.equal(stubSassWriteFile.getCall(0).args[1], destSass);
            done();
          }).catch(done);
      });
    });
    describe('異常系', () => {
      it('render', done => {
        stubSassRender.rejects();
        cssTemplate()
          .catch(error => {
            assert.equal(error.name, 'Error');
            done();
          });
      });
      it('writeFile', done => {
        stubSassWriteFile.rejects();
        cssTemplate()
          .catch(error => {
            assert.equal(error.name, 'Error');
            done();
          });
      });
      it('render & writeFile', done => {
        stubSassRender.rejects('renderError');
        stubSassWriteFile.rejects('writeFileError');
        cssTemplate()
          .catch(error => {
            assert.equal(error.name, 'renderError');
            done();
          });
      });
    });
  });
});
