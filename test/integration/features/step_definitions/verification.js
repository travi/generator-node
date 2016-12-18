const assert = require('yeoman-assert');
const exec = require('child_process').exec;
const fs = require('fs');

module.exports = function () {
  this.World = require('../support/world.js').World;

  this.Then(/^tests are configured$/, function (callback) {
    const pkg = require(`${this.tempDir}/package.json`);
    const devDependencies = Object.keys(pkg.devDependencies);

    assert(devDependencies.includes('mocha'));
    assert(devDependencies.includes('chai'));
    assert(devDependencies.includes('@travi/any'));

    assert.equal(pkg.scripts['lint:md'], 'globstar --node -- markdownlint **/*.md');
    assert.equal(pkg.scripts['tests:unit'], 'mocha --recursive test/unit');
    assert.equal(pkg.scripts.test, 'run-s lint:* tests:*');
    assert.equal(pkg.scripts.precommit, 'npm test');

    assert.fileContent('test/mocha.opts', `--ui tdd
`);

    fs.readFile('README.md', 'utf-8', (err, content) => {
      if (err) {
        callback(err);
      }

      assert(content.includes(this.getPromptAnswers().description));
      callback();
    });
  });

  this.Then(/^npm test passes$/, function (callback) {
    exec('npm test', callback);
  });
};
