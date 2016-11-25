const assert = require('yeoman-assert');

module.exports = function () {
  this.World = require('../support/world.js').World;

  this.Then(/^tests are configured$/, function (callback) {
    const pkg = require(`${this.tempDir}/package.json`);
    const devDependencies = Object.keys(pkg.devDependencies);

    assert(devDependencies.includes('mocha'));
    assert(devDependencies.includes('chai'));
    assert(devDependencies.includes('@travi/any'));

    callback();
  });
};
