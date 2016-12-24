const assert = require('yeoman-assert');
const exec = require('child_process').exec;
const fs = require('fs');
const defineSupportCode = require('cucumber').defineSupportCode;
const World = require('../support/world').World;

defineSupportCode(({Then, setWorldConstructor}) => {
  setWorldConstructor(World);

  Then(/^tests are configured$/, function (callback) {
    const pkg = require(`${this.tempDir}/package.json`);
    const devDependencies = Object.keys(pkg.devDependencies);

    assert(devDependencies.includes('mocha'));
    assert(devDependencies.includes('chai'));
    assert(devDependencies.includes('@travi/any'));

    assert.equal(pkg.scripts['lint:md'], 'globstar --node -- markdownlint **/*.md');
    assert.equal(pkg.scripts['tests:unit'], 'mocha --recursive test/unit');
    assert.equal(pkg.scripts.coverage, 'nyc run-s tests:unit');
    assert.equal(pkg.scripts.test, 'run-s lint:* coverage');
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

  Then(/^npm test passes$/, function (callback) {
    exec('npm test', callback);
  });
});
