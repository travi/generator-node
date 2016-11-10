const yeoman = require('yeoman-generator');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const path = require('path');
const any = require('@travi/any');
const mockery = require('mockery');
const sinon = require('sinon');

module.exports = function () {
  this.World = require('../support/world.js').World;

  const projectName = any.word();
  const license = any.word();
  const nodeVersion = any.word();

  this.Before(function () {
    this.answerPromptsWith({projectName, license});
    this.tempDir = path.join(__dirname, 'temp');

    mockery.registerMock('node-version-resolver', function (callback) {
      const satisfy = sinon.stub();
      satisfy.withArgs('*').returns(nodeVersion);
      callback({satisfy});
    });
    mockery.enable({warnOnUnregistered: false});
  });

  this.After(() => {
    mockery.disable();
    mockery.deregisterAll()
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
      'package.json',
      '.nvmrc'
    ]);
    assert.fileContent('.gitignore', 'node_modules/\n');
    assert.jsonFileContent(`${this.tempDir}/package.json`, {
      name: projectName,
      license
    });
    assert.fileContent('.nvmrc', `v${nodeVersion}`);

    callback();
  });
};
