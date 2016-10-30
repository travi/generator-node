const yeoman = require('yeoman-generator');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const path = require('path');
const sinon = require('sinon');

const tempDir = path.join(__dirname, 'temp');

module.exports = function () {
  const initializing = sinon.spy();

  this.When(/^the generator is run$/, function (callback) {
    helpers.run(path.join(__dirname, '../../../../app'))
      .inDir(tempDir)
      .withGenerators([[yeoman.Base.extend({initializing}), '@travi/git']])
      .on('end', callback);
  });

  this.Then(/^the git generator was extended$/, function (callback) {
    sinon.assert.calledOnce(initializing);

    callback();
  });

  this.Then(/^the core files should be present$/, function (callback) {
    assert.file(['.gitignore']);
    assert.fileContent('.gitignore', 'node_modules/\n');

    callback();
  });
};
