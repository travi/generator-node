const yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({
  configuring() {
    this.copy('_gitignore', '.gitignore');
  }
});
