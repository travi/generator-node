const yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({
  initializing() {
    this.composeWith('@travi/git', {options: this.options}, {
      local: require.resolve('@travi/generator-git/app')
    });
  },

  configuring() {
    this.copy('_gitignore', '.gitignore');
  },

  writing() {
    const pkg = {
      name: this.options.projectName,
      license: this.options.license
    };

    if ('UNLICENSED' === this.options.license) {
      pkg.private = true;
    }

    this.fs.extendJSON(this.destinationPath('package.json'), pkg);
  }
});
