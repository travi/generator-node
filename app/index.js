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
        commitmsg: 'validate-commit-msg'
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
  },

  install() {
    this.npmInstall([
      'npm-run-all',
      'husky',
      'validate-commit-msg',
      'cz-conventional-changelog'
    ], {saveDev: true});
  }
});
