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
});
