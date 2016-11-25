require('coffee-script/register');
const yeoman = require('yeoman-generator');
const Resolver = require('node-version-resolver');

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

  configuring() {
    this.copy('_gitignore', '.gitignore');
    this.template('_nvmrc', '.nvmrc');
  },

  writing() {
    const pkg = {
      name: this.options.projectName,
      license: this.options.license,
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
