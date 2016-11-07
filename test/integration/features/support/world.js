module.exports.World = function World() {
  this.promptAnswers = {};

  this.answerPromptsWith = function (answers) {
    this.promptAnswers = Object.assign({}, this.promptAnswers, answers);
  }

  this.getPromptAnswers = function () {
    return this.promptAnswers;
  }
};
