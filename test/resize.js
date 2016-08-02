const fs        = require('fs');
const readline  = require('readline');
const path      = require('path');
const assert    = require('chai').assert;
const request   = require('request');
const config    = require('../config/config');

const resize    = require('../lib/resize');

describe('lib/resize', () => {
  describe('hashName', () => {
    it('should compute matching hash', () => {
      var compareHash = '1f6f8417f0fafc43815e166a7cb041af13ba1ca3982c55cd56de1aa685cd84b5';
      var computeHash = resize.hashName('filepath', '42');
      assert.equal(compareHash, computeHash, 'hashes not equal');
    });
  });
  describe('truncateText', () => {
    it('should reject non-integer sizes', () => {
      resize.truncateText(null, 'non-integer', null, (file, err, code) => {
        assert.deepEqual(null, file, 'should not return filename');
        assert.equal(err, 'invalid size parameter', 'should return meaningful error');
        assert.deepEqual(code, 400, 'should return HTTP code 400');
      });
    });
    it('should resize to n lines', (done) => {
      let n = '5';
      let m = 0;
      let testfile = path.resolve(__dirname, 'dummy.txt');
      resize.truncateText(testfile, n, '.txt', (result) => {
        let rl = readline.createInterface({
          input: fs.createReadStream(result)
        });

        rl.on('line', (line) => {
          m++;
        });

        rl.on('close', () => {
          assert.equal(n, m, 'result is n lines long');
          done();
        });
      });
    });
  });
  describe('resizeImage', () => {
    it('should reject non-integer sizes', () => {
      resize.resizeImage(null, 'non-integer', null, (file, err, code) => {
        assert.deepEqual(null, file, 'should not return filename');
        assert.equal(err, 'invalid size parameter', 'should return meaningful error');
        assert.deepEqual(code, 400, 'should return HTTP code 400');
      });
    });
  });
});
