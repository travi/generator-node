const yeoman = require('yeoman-generator');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const path = require('path');
const fs = require('fs');
const any = require('@travi/any');
const mockery = require('mockery');
const sinon = require('sinon');
const defineSupportCode = require('cucumber').defineSupportCode;
const World = require('../support/world').World;

defineSupportCode(({Before, After, Given, When, Then, setWorldConstructor}) => {
  setWorldConstructor(World);

  const projectName = any.word();
  const license = any.word();
  const nodeVersion = any.word();

  Before(function () {
    this.answerPromptsWith({projectName, license});
    this.tempDir = path.join(__dirname, 'temp');

    mockery.registerMock('resolve-node-version', function (range, callback) {
      if ('*' === range) {
        callback(null, nodeVersion);
      } else {
        callback(new Error('incorrect range'));
      }
    });
    mockery.enable({warnOnUnregistered: false});
  });

  After(() => {
    mockery.disable();
    mockery.deregisterAll()
  });

  Given('the user responds to all prompts', function (callback) {
    this.answerPromptsWith({
      description: any.string(),
      fullName: any.word()
    });

    callback();
  });

  When(/^the generator is run$/, {timeout: 60 * 1000}, function (callback) {
    helpers.run(path.join(__dirname, '../../../../app'))
      .inDir(this.tempDir)
      .withOptions({skipInstall: false})
      .withPrompts(this.getPromptAnswers())
      .on('end', callback);
  });

  Then(/^the git generator was extended$/, function (callback) {
    assert.file(['.git']);

    callback();
  });

  Then(/^the required dependencies were installed$/, function (callback) {
    const pkg = require(`${this.tempDir}/package.json`);
    const devDependencies = Object.keys(pkg.devDependencies);

    assert(devDependencies.includes('npm-run-all'));
    assert(devDependencies.includes('husky'));
    assert(devDependencies.includes('validate-commit-msg'));
    assert(devDependencies.includes('cz-conventional-changelog'));
    assert(devDependencies.includes('markdownlint-cli'));
    assert(devDependencies.includes('globstar'));
    assert(devDependencies.includes('nyc'));

    assert.equal(pkg.config.commitizen.path, './node_modules/cz-conventional-changelog');
    assert.equal(pkg.scripts.commitmsg, 'validate-commit-msg');

    fs.readFile('README.md', 'utf-8', (err, content) => {
      if (err) {
        callback(err);
      }

      assert(content.includes('[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)'));
      callback();
    });
  });

  Then(/^the core files should be present$/, function (callback) {
    assert.file([
      '.gitignore',
      'package.json',
      '.nvmrc',
      '.npmrc'
    ]);
    assert.fileContent('.gitignore', `node_modules/
lib/
.nyc_output/
`);
    assert.fileContent('.eslintignore', 'lib/\n');
    assert.jsonFileContent(`${this.tempDir}/package.json`, {
      name: projectName,
      license,
      repository: this.githubRepo,
      bugs: `https://github.com/${this.githubRepo}/issues`,
      homepage: `https://github.com/${this.githubRepo}#readme`
    });
    assert.fileContent('.nvmrc', `v${nodeVersion}`);
    assert.jsonFileContent('.markdownlintrc', {
      "line_length": {"code_blocks": false},
      "commands-show-output": false
    });
    assert.jsonFileContent('.nycrc', {
      "exclude": [
        "**/*-test.js",
        "scripts/"
      ]
    });
    assert.fileContent('.npmrc', 'save-exact=true')

    callback();
  });

  Then('the user provided answers should be used', function (callback) {
    const pkg = require(`${this.tempDir}/package.json`);

    assert.equal(pkg.description, this.getPromptAnswers().description);
    assert.equal(pkg.author, this.getPromptAnswers().fullName);

    callback();
  });
});
