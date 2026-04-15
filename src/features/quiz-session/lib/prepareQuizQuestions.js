import shuffleArray from './shuffleArray.js';

export default function prepareQuizQuestions(questions) {
  return shuffleArray(
    questions.map((question) => ({
      ...question,
      opcoes: shuffleArray([...question.opcoes]),
    })),
  );
}
