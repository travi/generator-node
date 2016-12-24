const gitConfig = require('git-config');
const any = require('@travi/any');
const sinon = require('sinon');
const defineSupportCode = require('cucumber').defineSupportCode;
const World = require('../support/world').World;

defineSupportCode(({Before, After, setWorldConstructor}) => {
  setWorldConstructor(World);

  let sandbox;
  const name = `${any.word()} ${any.word()}`;

  Before(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(gitConfig, 'sync').returns({
      user: {name}
    });
  });

  After(() => {
    sandbox.restore();
  });
});
