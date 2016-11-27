require('coffee-script/register');
const yeoman = require('yeoman-generator');
const Resolver = require('node-version-resolver');
const _ = require('lodash');

module.exports = yeoman.Base.extend({
  initializing() {
    this.composeWith('@travi/git', {options: this.options}, {
      local: require.resolve('@travi/generator-git/app')
    });

    return new Promise((resolve, reject) => {
      new Resolver((resolver) => {
        this.nodeVersion = resolver.satisfy('*');

        resolve();
      });
    });
  },

  prompting() {
    return this.prompt([{
      message: 'A brief description of this project',
      name: 'description'
    }]).then(props => {
      _.merge(this.options, props);
    })
  },

  configuring() {
    this.copy('_gitignore', '.gitignore');
    this.template('_nvmrc', '.nvmrc');

    this.copy('test/_mocha.opts', 'test/mocha.opts');
    this.copy('test/_canary-test.js', 'test/unit/canary-test.js');
  },

  writing() {
    const pkg = {
      name: this.options.projectName,
      license: this.options.license,
      description: this.options.description,
      scripts: {
        'tests:unit': 'mocha --recursive test/unit',
        test: 'run-s tests:*',
        commitmsg: 'validate-commit-msg',
        precommit: 'npm test'
      },
      config: {
        commitizen: {
          path: './node_modules/cz-conventional-changelog'
        }
      }
    };

    if ('UNLICENSED' === this.options.license) {
      pkg.private = true;
    }

    this.fs.extendJSON(this.destinationPath('package.json'), pkg);

    this.fs.write(this.destinationPath('README.md'), `${this.fs.read(this.destinationPath('README.md'))}
${this.options.description}

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
`)
  },

  install() {
    this.npmInstall([
      'npm-run-all',
      'husky',
      'validate-commit-msg',
      'cz-conventional-changelog',
      'mocha',
      'chai',
      '@travi/any'
    ], {saveDev: true});
  }
});
