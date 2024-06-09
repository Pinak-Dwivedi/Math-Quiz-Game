const container = document.querySelector("[data-container]");
const score = document.querySelector("[data-score]");
const highScore = document.querySelector("[data-high-score]");
const question = document.querySelector("[data-question]");
const choices = document.querySelector("[data-choices]");

const QUESTIONS = [
  {
    question: "What is 9 + 3?",
    choices: [12, 8, 4, 15],
    correctAns: 12,
  },
  {
    question: "What is 15 + 22?",
    choices: [35, 37, 42, 38],
    correctAns: 37,
  },
  {
    question: "What is 152 - 95?",
    choices: [58, 66, 57, 35],
    correctAns: 57,
  },
  {
    question: "What is 15 * 30?",
    choices: [450, 150, 550, 900],
    correctAns: 450,
  },
  {
    question: "What is 88 / 4?",
    choices: [32, 22, 20, 18],
    correctAns: 22,
  },
  {
    question: "What is 99 - 33?",
    choices: [60, 33, 43, 66],
    correctAns: 66,
  },
  {
    question: "What is 422 + 811?",
    choices: [1033, 1233, 1130, 1333],
    correctAns: 1233,
  },
  {
    question: "What is 55 / 5?",
    choices: [15, 10, 25, 11],
    correctAns: 11,
  },
  {
    question: "What is 63 + 153?",
    choices: [290, 196, 216, 213],
    correctAns: 216,
  },
  {
    question: "What is 339 * 5?",
    choices: [1695, 1555, 1895, 1795],
    correctAns: 1695,
  },
];

const LOCAL_STORAGE_KEY = "MATH_QUIZ_GAME_HIGH_SCORE";
let currentQuestionIndex = 0;
let currentQuestion = QUESTIONS[currentQuestionIndex];
let playerScore = 0;
let currentHighScore = 0;

gameStart();

function updateQuestion(questionIndex = 0) {
  if (questionIndex > QUESTIONS.length - 1) {
    handleQuestionsOver();
    return;
  }

  currentQuestionIndex = questionIndex;
  currentQuestion = QUESTIONS[currentQuestionIndex];

  question.textContent = currentQuestion.question;

  const fragment = document.createDocumentFragment();

  currentQuestion.choices.forEach((ans) => {
    const button = createButton(ans, ans, "btn", "choice-btn");
    button.addEventListener("click", handleChoice);

    fragment.append(button);
  });

  choices.innerHTML = "";
  choices.append(fragment);
}

function handleChoice(e) {
  disableButtons();

  const button = e.target;
  const ans = button.dataset.choiceButton;

  if (ans == currentQuestion.correctAns) {
    container.classList.add("right");
    button.classList.add("right");
    handleCorrectAnswer();
  } else {
    const correctButton = document.querySelector(
      `[data-choice-button="${currentQuestion.correctAns}"]`
    );
    correctButton.classList.add("right");
    container.classList.add("wrong");
    button.classList.add("wrong");
    handleIncorrectAnswer();
  }
}

function disableButtons() {
  document.querySelectorAll("[data-choice-button]").forEach((button) => {
    button.disabled = true;
  });
}

function updateScore(newScore = 0) {
  playerScore = newScore;
  score.textContent = playerScore;

  if (playerScore > currentHighScore) {
    currentHighScore = playerScore;
    highScore.textContent = currentHighScore;
    setLocalStorageHighScore(currentHighScore);
  }
}

function gameStart() {
  updateQuestion(currentQuestionIndex);
  updateScore(playerScore);
  getLocalStorageHighScore();
  removeContainerClasses();
}

function handleCorrectAnswer() {
  const fragment = document.createDocumentFragment();

  const nextQuestionButton = createButton("Next", "next", "btn", "choice-btn");
  nextQuestionButton.addEventListener("click", handleNextQuestion);

  const resetGameButton = createButton("Reset", "reset", "btn", "reset-btn");
  resetGameButton.addEventListener("click", resetGame);

  fragment.append(resetGameButton);
  fragment.append(nextQuestionButton);

  choices.append(fragment);
}

function handleIncorrectAnswer() {
  const fragment = document.createDocumentFragment();

  const retryButton = createButton("Retry", "retry", "btn", "choice-btn");
  retryButton.addEventListener("click", handleRetry);

  const resetGameButton = createButton("Reset", "reset", "btn", "reset-btn");
  resetGameButton.addEventListener("click", resetGame);

  fragment.append(resetGameButton);
  fragment.append(retryButton);

  choices.append(fragment);
}

function handleNextQuestion() {
  updateQuestion(currentQuestionIndex + 1);
  updateScore(playerScore + 1);
  removeContainerClasses();
}

function handleRetry() {
  updateQuestion(currentQuestionIndex);
  removeContainerClasses();
}

function resetGame() {
  updateQuestion(0);
  updateScore(0);
  removeContainerClasses();
}

function handleQuestionsOver() {
  question.textContent = "More questions coming soon...";

  const resetGameButton = createButton("Reset", "reset", "btn", "reset-btn");
  resetGameButton.addEventListener("click", resetGame);
  resetGameButton.style.gridColumn = "span 2";

  choices.innerHTML = "";
  choices.append(resetGameButton);
}

function getLocalStorageHighScore() {
  const localStorageHighScore = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (localStorageHighScore != null) {
    currentHighScore = Number(localStorageHighScore);
    highScore.textContent = currentHighScore;
  } else {
    setLocalStorageHighScore(0);
    currentHighScore = 0;
    highScore.textContent = currentHighScore;
  }
}

function setLocalStorageHighScore(newHighScore = 0) {
  localStorage.setItem(LOCAL_STORAGE_KEY, newHighScore.toString());
}

function createButton(text, dataValue, ...classNames) {
  const button = document.createElement("button");
  button.classList.add(...classNames);
  button.dataset.choiceButton = dataValue;
  button.textContent = text;

  return button;
}

function removeContainerClasses() {
  container.classList.remove("right");
  container.classList.remove("wrong");
}
