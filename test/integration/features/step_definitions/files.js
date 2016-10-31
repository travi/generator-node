const yeoman = require('yeoman-generator');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const path = require('path');
const sinon = require('sinon');
const any = require('@travi/any');

const tempDir = path.join(__dirname, 'temp');

module.exports = function () {
  const initializing = sinon.spy();
  const projectName = any.word();
  const license = any.word();

  this.When(/^the generator is run$/, function (callback) {
    helpers.run(path.join(__dirname, '../../../../app'))
      .inDir(tempDir)
      .withGenerators([[yeoman.Base.extend({
        initializing,
        prompting() {
          this.config.set('projectName', projectName);
          this.config.set('license', license);
        }
      }), '@travi/git']])
      .on('end', callback);
  });

  this.Then(/^the git generator was extended$/, function (callback) {
    sinon.assert.calledOnce(initializing);

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
