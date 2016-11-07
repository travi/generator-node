const gitConfig = require('git-config');
const any = require('@travi/any');
const sinon = require('sinon');

module.exports = function () {
  let sandbox;
  const name = `${any.word()} ${any.word()}`;

  this.Before(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(gitConfig, 'sync').returns({
      user: {name}
    });
  });

  this.After(() => {
    sandbox.restore();
  });
};
