const yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({
  initializing() {
    this.composeWith('@travi/git');
  },

  configuring() {
    this.copy('_gitignore', '.gitignore');
  },

  writing() {
    this.fs.writeJSON(this.destinationPath('package.json'), {
      name: this.config.get('projectName'),
      license: this.config.get('license')
    });
  }
});
