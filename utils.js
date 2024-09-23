const validator = require("validator");

function quizValid(quiz) {
  return (quiz.data.name && quiz.facts.length > 0 && quiz.facts.every(fact => fact.text));
}

function quizEscaped(quiz) {
  return {
    data: {
      id: isNaN(quiz.data.id) ? undefined : quiz.data.id, // a new quiz to be saved will not have an ID; a quiz being modified will
      name: validator.escape(quiz.data.name),
      description: validator.escape(quiz.data.description),
      owner: validator.escape(quiz.data.owner)
    },
    facts: quiz.facts.map(fact => ({
      text: validator.escape(fact.text),
      info: validator.escape(fact.info),
      hint: validator.escape(fact.hint)
    }))
  }
}

function quizUnescaped(quiz) {
  return {
    data: {
      id: quiz.data.id,
      name: validator.unescape(quiz.data.name),
      description: validator.unescape(quiz.data.description),
      owner: validator.unescape(quiz.data.owner)
    },
    facts: quiz.facts.map(fact => ({
      text: validator.unescape(fact.text),
      info: validator.unescape(fact.info),
      hint: validator.unescape(fact.hint)
    }))
  }
}

module.exports = {quizValid,quizEscaped,quizUnescaped};