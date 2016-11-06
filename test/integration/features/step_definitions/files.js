const yeoman = require('yeoman-generator');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const path = require('path');
const sinon = require('sinon');
const any = require('@travi/any');

const tempDir = path.join(__dirname, 'temp');

module.exports = function () {
  const projectName = any.word();
  const license = any.word();

  this.When(/^the generator is run$/, function (callback) {
    helpers.run(path.join(__dirname, '../../../../app'))
      .inDir(tempDir)
      .withPrompts({projectName, license})
      .on('end', callback);
  });

  this.Then(/^the git generator was extended$/, function (callback) {
    assert.file(['.git']);

    callback();
  });

  this.Then(/^the core files should be present$/, function (callback) {
    assert.file([
      '.gitignore',
      'package.json'
    ]);
    assert.fileContent('.gitignore', 'node_modules/\n');
    assert.jsonFileContent(`${tempDir}/package.json`, {
      name: projectName,
      license
    });

    callback();
  });
};
