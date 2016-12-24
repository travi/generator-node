const assert = require('yeoman-assert');
const defineSupportCode = require('cucumber').defineSupportCode;
const World = require('../support/world').World;

defineSupportCode(({Given, Then, setWorldConstructor}) => {
  setWorldConstructor(World);

  Given(/^the project should not be licensed$/, function (callback) {
    this.answerPromptsWith({license: 'UNLICENSED'});

    callback();
  });

  Then(/^the package is marked private$/, function (callback) {
    assert.jsonFileContent(`${this.tempDir}/package.json`, {
      private: true
    });

    callback();
  });
});
