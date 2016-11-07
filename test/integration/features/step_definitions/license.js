const assert = require('yeoman-assert');

module.exports = function () {
  this.World = require('../support/world.js').World;

  this.Given(/^the project should not be licensed$/, function (callback) {
    this.answerPromptsWith({license: 'UNLICENSED'});

    callback();
  });

  this.Then(/^the package is marked private$/, function (callback) {
    assert.jsonFileContent(`${this.tempDir}/package.json`, {
      private: true
    });

    callback();
  });
};
