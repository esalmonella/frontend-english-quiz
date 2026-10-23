const BASE_WORDS = [
  {
    word: "book",
    translation: "книжка",
  },
  {
    word: "tree",
    translation: "дерево",
  },
  {
    word: "window",
    translation: "вікно",
  },
  {
    word: "image",
    translation: "зображення",
  },
  {
    word: "black",
    translation: "чорний",
  },
  {
    word: "time",
    translation: "час",
  },
  {
    word: "red",
    translation: "червоний",
  },
  {
    word: "apple",
    translation: "яблуко",
  },
  {
    word: "keyboard",
    translation: "клавіатура",
  },
  {
    word: "word",
    translation: "слово",
  },
];

const WORDS_LENGTH = BASE_WORDS.length;
const words = randomizeWords(BASE_WORDS);

$(() => {
  let currentWordCounter = 0;
  let currentWord = words[0];
  const answeredWords = [];
  let correctAnswers = 0;
  let incorrectAnswers = 0;

  const { $container } = createContainer();
  const { $card, $cardTitle } = createCard();
  const { $navigationContainer, $nextButton, $cardsCounter, $prevButton } =
    createNavigation();

  const { $answerForm, $answerInput } = createAnswerForm();
  const {
    $statisticsContainer,
    $correctAnswersCounter,
    $incorrectAnswersCounter,
  } = createStatistics();

  $cardTitle.text(currentWord.word);

  $answerForm.on("submit", (event) => event.preventDefault());

  $card.on("click", () => {
    const userTranslation = $answerInput.val();
    const hasAnswered = answeredWords.some((word) => {
      return word.word === currentWord.word;
    });

    const isEmpty = !userTranslation || !userTranslation.trim().length;

    if (hasAnswered || isEmpty) return;

    const isCorrectAnswer =
      userTranslation.trim().toLowerCase() === currentWord.translation;

    if (isCorrectAnswer) {
      correctAnswers++;
      $correctAnswersCounter.text(correctAnswers);
    } else {
      incorrectAnswers++;
      $incorrectAnswersCounter.text(incorrectAnswers);
    }

    answeredWords.push(currentWord);

    if (answeredWords.length === WORDS_LENGTH) {
      const { $resultsOverlay } = createResultsModal(correctAnswers);

      $("body").append($resultsOverlay);
    }
  });

  const updateWord = (newValue) => {
    currentWordCounter = newValue;
    $cardsCounter.text(`${currentWordCounter + 1}/10`);
    currentWord = words[currentWordCounter];
    $cardTitle.text(currentWord.word);
  };

  $prevButton.on("click", () => {
    if (currentWordCounter <= 0) {
      return;
    }

    updateWord(currentWordCounter - 1);
  });

  $nextButton.on("click", () => {
    if (currentWordCounter >= WORDS_LENGTH - 1) {
      return;
    }

    updateWord(currentWordCounter + 1);
  });

  $container.append(
    $card,
    $navigationContainer,
    $answerForm,
    $statisticsContainer,
  );
  $container.appendTo("body");
});

function createResultsModal(correctAnswers) {
  const $resultsOverlay = $("<div>").css({
    position: "fixed",
    inset: "0",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: "10",
  });

  let englishLevel;

  if (correctAnswers >= 0 && correctAnswers < 2) {
    englishLevel = "A1";
  } else if (correctAnswers >= 2 && correctAnswers < 4) {
    englishLevel = "A2";
  } else if (correctAnswers >= 4 && correctAnswers < 6) {
    englishLevel = "B1";
  } else if (correctAnswers >= 6 && correctAnswers < 8) {
    englishLevel = "B2";
  } else {
    englishLevel = "C1";
  }

  const $resultsModal = $("<div>").css({
    position: "absolute",
    zIndex: "20",
    backgroundColor: "white",
    borderRadius: "16px",
    maxWidth: "400px",
    width: "100%",
    minHeight: "300px",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    gap: "20px",
  });

  const $resultsText = $("<p>", {
    text: `Ви переклали правильно ${correctAnswers} з ${WORDS_LENGTH} слів. Ваш рівень - ${englishLevel}`,
  }).css({
    textAlign: "center",
  });

  const $resetButton = $("<button>", { text: "Спробувати ще раз?" }).css({
    backgroundColor: "white",
    padding: "8px",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.3)",
    borderRadius: "16px",
  });
  $resetButton.on("click", () => location.reload());

  $resultsModal.append($resultsText, $resetButton);
  $resultsOverlay.append($resultsModal);

  return {
    $resultsOverlay,
  };
}

function randomizeWords(words) {
  const randomizedWords = [];
  const usedIndexes = [];

  function getRandomIndex(used) {
    const value = Math.floor(Math.random() * WORDS_LENGTH);
    if (used.includes(value)) {
      return getRandomIndex(used);
    }

    return value;
  }

  for (let i = 0; i < WORDS_LENGTH; ++i) {
    const index = getRandomIndex(usedIndexes);
    usedIndexes.push(index);
    randomizedWords.push(words[index]);
  }

  return randomizedWords;
}

function createContainer() {
  const $container = $("<div>").css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    minHeight: "100dvh",
    gap: "20px",
  });

  return { $container };
}

function createCard() {
  const $card = $("<div>").css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: "16px",
    maxWidth: "300px",
    width: "100%",
    minHeight: "150px",
    boxShadow: "0 0 15px 2px rgba(0, 0, 0, 0.3)",
  });

  const $cardTitle = $("<h3>").css({
    textAlign: "center",
    fontSize: "24px",
    color: "black",
  });
  $cardTitle.appendTo($card);

  return {
    $card,
    $cardTitle,
  };
}

function createNavigation() {
  const $navigationContainer = $("<div>").css({
    display: "flex",
    alignItems: "center",
    gap: "12px",
  });

  const $prevButton = $("<button>", { text: "←" }).css({
    background: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
  });
  const $cardsCounter = $("<span>", { text: `1/${WORDS_LENGTH}` });
  const $nextButton = $("<button>", { text: "→" }).css({
    background: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
  });

  $navigationContainer.append($prevButton, $cardsCounter, $nextButton);

  return {
    $navigationContainer,
    $prevButton,
    $cardsCounter,
    $nextButton,
  };
}

function createAnswerForm() {
  const $answerForm = $("<form>");

  const $answerInput = $("<input>", {
    type: "text",
    placeholder: "Переклад",
  }).css({
    padding: "5px 10px",
  });

  $answerForm.append($answerInput);

  return {
    $answerForm,
    $answerInput,
  };
}

function createStatistics() {
  const $statisticsContainer = $("<div>").css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontWeight: "bold",
  });

  const $statisticsTitle = $("<h3>", { text: "Статистика" }).css({
    color: "blue",
    fontSize: "18px",
    marginBottom: "15px",
  });

  const $answersContainer = $("<div>").css({
    display: "flex",
    justifyContent: "space-between",
    minWidth: "300px",
  });

  const $correctAnswersContainer = $("<div>").css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "green",
  });

  const $correctAnswersTitle = $("<h3>", { text: "Вірно" });
  const $correctAnswersCounter = $("<span>", { text: 0 });

  $correctAnswersContainer.append($correctAnswersTitle, $correctAnswersCounter);

  const $incorrectAnswersContainer = $("<div>").css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "red",
  });

  const $incorrectAnswersTitle = $("<h3>", { text: "Невірно" });
  const $incorrectAnswersCounter = $("<span>", { text: 0 });

  $incorrectAnswersContainer.append(
    $incorrectAnswersTitle,
    $incorrectAnswersCounter,
  );

  $answersContainer.append(
    $correctAnswersContainer,
    $incorrectAnswersContainer,
  );

  $statisticsContainer.append($statisticsTitle, $answersContainer);

  return {
    $statisticsContainer,
    $correctAnswersCounter,
    $incorrectAnswersCounter,
  };
}
