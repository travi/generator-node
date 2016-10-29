const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const path = require('path');

const tempDir = path.join(__dirname, 'temp');

module.exports = function () {
  this.When(/^the generator is run$/, function (callback) {
    helpers.run(path.join(__dirname, '../../../../app'))
      .inDir(tempDir)
      .on('end', callback);
  });

  this.Then(/^the core files should be present$/, function (callback) {
    assert.file([
      '.gitignore'
    ]);
    assert.fileContent('.gitignore', 'node_modules/\n');

    callback();
  });
};
