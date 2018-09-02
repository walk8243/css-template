const assert    = require('assert'),
      fs        = require('fs'),
      path      = require('path'),
      sinon     = require('sinon');
const func      = require('../modules/func');

describe('func Module', () => {
  it('Moduleの内容確認', () => {
    assert.deepEqual(Object.keys(func), ['isExistFile', 'isExistDir', 'prepareStorage']);
    assert.equal(typeof func.isExistFile, 'function');
    assert.equal(typeof func.isExistDir, 'function');
    assert.equal(typeof func.prepareStorage, 'function');
  });

  describe('isExistFile', () => {
    var stubFsStatSync,
        stubStatsIsFile;
    const stats = new fs.Stats();
    before(() => {
      stubFsStatSync = sinon.stub(fs, 'statSync');
      stubStatsIsFile = sinon.stub(stats, 'isFile');
    });
    after(() => {
      stubFsStatSync.restore();
      stubStatsIsFile.restore();
    });
    beforeEach(() => {
      stubFsStatSync.returns(stats);
      stubStatsIsFile.returns(true);
    });
    afterEach(() => {
      stubFsStatSync.reset();
      stubStatsIsFile.reset();
    });

    it('正常系', () => {
      assert.ok(func.isExistFile('fuga'));
      assert.ok(stubFsStatSync.calledOnce);
      assert.ok(stubStatsIsFile.calledOnce);
    });
    describe('異常系', () => {
      it('statSync Error', () => {
        stubFsStatSync.throws();
        assert.ok(!func.isExistFile('fuga'));
        assert.ok(stubFsStatSync.calledOnce);
        assert.ok(stubStatsIsFile.notCalled);
      });
      it('stats isFile Error', () => {
        stubStatsIsFile.returns(false);
        assert.ok(!func.isExistFile('fuga'));
        assert.ok(stubFsStatSync.calledOnce);
        assert.ok(stubStatsIsFile.calledOnce);
      });
    });
  });

  describe('isExistDir', () => {
    var stubFsStatSync,
        stubStatsIsDirectory;
    const stats = new fs.Stats();
    before(() => {
      stubFsStatSync = sinon.stub(fs, 'statSync');
      stubStatsIsDirectory = sinon.stub(stats, 'isDirectory');
    });
    after(() => {
      stubFsStatSync.restore();
      stubStatsIsDirectory.restore();
    });
    beforeEach(() => {
      stubFsStatSync.returns(stats);
      stubStatsIsDirectory.returns(true);
    });
    afterEach(() => {
      stubFsStatSync.reset();
      stubStatsIsDirectory.reset();
    });

    it('正常系', () => {
      assert.ok(func.isExistDir('fuga'));
      assert.ok(stubFsStatSync.calledOnce);
      assert.ok(stubStatsIsDirectory.calledOnce);
    });
    describe('異常系', () => {
      it('statSync Error', () => {
        stubFsStatSync.throws();
        assert.ok(!func.isExistDir('fuga'));
        assert.ok(stubFsStatSync.calledOnce);
        assert.ok(stubStatsIsDirectory.notCalled);
      });
      it('stats isDirectory Error', () => {
        stubStatsIsDirectory.returns(false);
        assert.ok(!func.isExistDir('fuga'));
        assert.ok(stubFsStatSync.calledOnce);
        assert.ok(stubStatsIsDirectory.calledOnce);
      });
    });
  });

  describe('prepareStorage', () => {
    var stubPathDirname,
        stubFuncIsExistDir,
        stubFsMkdirSync,
        spyFuncPrepareStorage;
    before(() => {
      stubPathDirname = sinon.stub(path, 'dirname');
      stubFuncIsExistDir = sinon.stub(func, 'isExistDir');
      stubFsMkdirSync = sinon.stub(fs, 'mkdirSync');
      spyFuncPrepareStorage = sinon.spy(func, 'prepareStorage');
    });
    after(() => {
      stubPathDirname.restore();
      stubFuncIsExistDir.restore();
      stubFsMkdirSync.restore();
      spyFuncPrepareStorage.restore();
    });
    beforeEach(() => {
      stubPathDirname.returns('hoge');
      stubFuncIsExistDir.returns(true);
      stubFsMkdirSync.returns();
    });
    afterEach(() => {
      stubPathDirname.reset();
      stubFuncIsExistDir.reset();
      stubFsMkdirSync.reset();
      spyFuncPrepareStorage.resetHistory();
    });

    describe('正常系', () => {
      it('1回のみ', () => {
        func.prepareStorage('fuga');
        assert.ok(spyFuncPrepareStorage.calledOnce);
        assert.ok(stubPathDirname.calledOnce);
        assert.ok(stubFuncIsExistDir.calledOnce);
        assert.ok(stubFsMkdirSync.notCalled);
      });
      it('2回', () => {
        stubFuncIsExistDir.onFirstCall().returns(false);
        func.prepareStorage('fuga');
        assert.ok(spyFuncPrepareStorage.calledTwice);
        assert.ok(stubPathDirname.calledTwice);
        assert.ok(stubFuncIsExistDir.calledTwice);
        assert.ok(stubFsMkdirSync.calledOnce);
      });
      it('5回目で終了', () => {
        stubFuncIsExistDir.returns(false);
        stubFuncIsExistDir.onCall(5-1).returns(true);
        func.prepareStorage('fuga');
        assert.equal(spyFuncPrepareStorage.callCount, 5);
        assert.equal(stubPathDirname.callCount, 5);
        assert.equal(stubFuncIsExistDir.callCount, 5);
        assert.equal(stubFsMkdirSync.callCount, 4);
      });
    });
    describe('異常系',() => {
      it('path dirname Error', () => {
        stubPathDirname.throws('path dirname Error');
        try {
          func.prepareStorage('fuga');
          assert.fail();
        } catch(error) {
          assert.equal(error.name, 'path dirname Error');
          assert.ok(stubPathDirname.calledOnce);
        }
      });
      it('fs mkdirSync Error', () => {
        stubFsMkdirSync.throws('fs mkdirSync Error');
        stubFuncIsExistDir.onFirstCall().returns(false);
        try {
          func.prepareStorage('fuga');
          assert.fail();
        } catch(error) {
          assert.equal(error.name, 'fs mkdirSync Error');
          assert.ok(stubPathDirname.calledTwice);
          assert.ok(stubFuncIsExistDir.calledTwice);
          assert.ok(spyFuncPrepareStorage.calledTwice);
          assert.ok(stubFsMkdirSync.calledOnce);
        }
      });
    });
  });
});
