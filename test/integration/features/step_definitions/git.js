const gitConfig = require('parse-git-config');
const any = require('@travi/any');
const sinon = require('sinon');
const defineSupportCode = require('cucumber').defineSupportCode;
const World = require('../support/world').World;

defineSupportCode(({Before, After, setWorldConstructor}) => {
  setWorldConstructor(World);

  let sandbox;
  const name = `${any.word()} ${any.word()}`;
  const user = any.word();
  const repo = any.word();

  Before(function () {
    this.githubRepo = `${user}/${repo}`;

    sandbox = sinon.sandbox.create();
    sandbox.stub(gitConfig, 'sync').returns({
      user: {name},
      'remote "origin"': {
        url: `git@github.com:${user}/${repo}`
      }
    });
  });

  After(() => {
    sandbox.restore();
  });
});
