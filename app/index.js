const yeoman = require('yeoman-generator');
const resolveNodeVersion = require('resolve-node-version');
const _ = require('lodash');
const gitConfig = require('git-config');
const githubUrl = require('github-url-to-object');

module.exports = yeoman.Base.extend({
  initializing() {
    this.composeWith('@travi/git', {options: this.options}, {
      local: require.resolve('@travi/generator-git/app')
    });

    this.originUrl = gitConfig.sync()['remote "origin"'].url;

    return new Promise((resolve, reject) => {
      resolveNodeVersion('*', (err, version) => {
        this.nodeVersion = version;

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
    this.copy('_eslintignore', '.eslintignore');
    this.template('_nvmrc', '.nvmrc');
    this.copy('_markdownlintrc', '.markdownlintrc');
    this.copy('_nycrc', '.nycrc');

    this.copy('test/_mocha.opts', 'test/mocha.opts');
    this.copy('test/_canary-test.js', 'test/unit/canary-test.js');
  },

  writing() {
    const githubDetails = githubUrl(this.originUrl);

    const pkg = {
      name: this.options.projectName,
      description: this.options.description,
      license: this.options.license,
      author: this.options.fullName,
      repository: `${githubDetails.user}/${githubDetails.repo}`,
      bugs: `https://github.com/${githubDetails.user}/${githubDetails.repo}/issues`,
      homepage: `https://github.com/${githubDetails.user}/${githubDetails.repo}#readme`,
      scripts: {
        'lint:md': 'globstar --node -- markdownlint **/*.md',
        'tests:unit': 'mocha --recursive test/unit',
        test: 'run-s lint:* coverage',
        coverage: 'nyc run-s tests:unit',
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
      '@travi/any',
      'markdownlint-cli',
      'globstar',
      'nyc'
    ], {saveDev: true});
  }
});
