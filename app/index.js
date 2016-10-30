const yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({
  initializing() {
    this.composeWith('@travi/git');
  },

  configuring() {
    this.copy('_gitignore', '.gitignore');
  }
});
