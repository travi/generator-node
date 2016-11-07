const yeoman = require('yeoman-generator');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const path = require('path');
const any = require('@travi/any');

module.exports = function () {
  this.World = require('../support/world.js').World;

  const projectName = any.word();
  const license = any.word();

  this.Before(function () {
    this.answerPromptsWith({projectName, license});
    this.tempDir = path.join(__dirname, 'temp');
  });

  this.When(/^the generator is run$/, function (callback) {
    helpers.run(path.join(__dirname, '../../../../app'))
      .inDir(this.tempDir)
      .withPrompts(this.getPromptAnswers())
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
    assert.jsonFileContent(`${this.tempDir}/package.json`, {
      name: projectName,
      license
    });

    callback();
  });
};
