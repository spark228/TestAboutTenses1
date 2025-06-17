const PrPr = "Present Perfect"
const FuS = "Future Simple"
const PaS = "Past Simple"
const PaPr = "Past Perfect"
const PaC = "Past Continuous"
const PrS = "Present Simple"
const PrCn = "Present Continuous"
const PrPerCn = "Present Perfect Continuous"
//const questions = [

  
//];
let questions = [
    {
    question: "while ...",
    options: [PaPr, PaC, PaS, PrCn, PrPerCn],
    correct: [1]
  },
  {
    question: "up to now",
    options: [PaPr, PrS, PaS, PrCn, PrPr],
    correct: [4]
  },
  {
    question: "one day",
    options: [PaS, PrS, FuS, PrCn, PrPr],
    correct: [0, 2]
  },
  {
    question: "... by the time I arrived",
    options: [FuS, PrPr, PaS, PaPr, PaC],
    correct: [3]
  },
  {
    question: "will + if + ...",
    options: [PaS, PaPr, FuS, PrS],
    correct: [3]
  },
  {
    question: "so far",
    options: [PrCn, FuS, PaC, PaS, PrPr],
    correct: [4]
  },
  {
    question: "before then",
    options: [PaPr, PrPr, PaC, PaS],
    correct: [0]
  },
  {
    question: "typically",
    options: [PrS, PrPr, PaC, PaS],
    correct: [0, 3]
  },
  {
    question: "since then",
    options: [PaS, PrPr, PaPr,FuS ,PaC ],
    correct: [1]
  },
  {
    question: "recently",
    options: [PaC, PaS, PaPr, PrPr, PrCn],
    correct: [1, 2, 3]
  },
  {
    question: "this week",
    options: [PrCn, PaPr, PrPr, FuS],
    correct: [0, 2, 3]
  },
  {
    question: "currently",
    options: [PrPerCn, PaC, PrCn, PrS, PaS],
    correct: [2]
  },
  {
    question: "by 2022",
    options: [FuS, PrPr, PaS, PaPr, PaC],
    correct: [3]
  },
  {
    question: "nowadays",
    options: [PaC, PrPr, PrPerCn, PrCn],
    correct: [3]
  },
  {
    question: "for many hours (now)",
    options: [PrPerCn, PaS, PrPr, PrCn, PrS],
    correct: [0, 2]
  },
  {
    question: "in the next year or two",
    options: [PaPr, PrS, PrPr, FuS, PaC],
    correct: [3]
  },
  {
    question: "in 2023",
    options: [PrPr, PaS, PaC, FuS, PaPr],
    correct: [1, 2]
  },
  {
    question: "these days",
    options: [PaS, PaC, PrPerCn, PrCn, PrPr],
    correct: [3]
  },
  {
    question: "hardly ever",
    options: [PrS, PaPr, PrPr, PrCn, PaC],
    correct: [0]
  },
  {
    question: "the other day",
    options: [PaS, PrCn, PaPr, PrS, FuS],
    correct: [0]
  },
  {
    question: "annually",
    options: [PrS, PrPr, PaS, PaPr],
    correct: [0, 1]
  },
  {
    question: "by now",
    options: [PrPerCn, PrPr, FuS, PaC],
    correct: [1]
  },
  {
    question: "on an average day",
    options: [PaS, PrCn, PaPr, PrS, PrPr],
    correct: [0, 3]
  },
  {
    question: "most days",
    options: [PrPr, PrS, PaS, PrCn],
    correct: [1, 2]
  },
  {
    question: "every other day",
    options: [PrS, FuS, PaC, PrCn],
    correct: [0, 1]
  },
]; // Загрузка внешнего массива вопросов здесь

let current = 0;
let selectedAnswers = new Array(questions.length).fill(null).map(() => []);
let answeredQuestions = new Set();
let correctCount = 0;
let isAutoAdvancing = false;

const quizEl = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressText = document.getElementById("progressText");
const chooseMsg = document.getElementById("chooseMsg");
const resultEl = document.getElementById("result");
const scoreText = document.getElementById("scoreText");
const showResultsBtn = document.getElementById("showResultsBtn");
const restartBtn = document.getElementById("restartBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function showQuestion(index) {
  const q = questions[index];
  questionEl.textContent = q.question;
  progressText.textContent = `Вопрос ${index + 1} / ${questions.length}`;
  chooseMsg.textContent = q.correct.length > 1 ? `Выберите ${q.correct.length} ответов` : "";

  optionsEl.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("div");
    btn.className = "option";
    btn.textContent = opt;
    btn.dataset.index = i;

    if (answeredQuestions.has(index)) {
      if (q.correct.includes(i)) {
        btn.classList.add("correct");
      } else if (selectedAnswers[index].includes(i)) {
        btn.classList.add("wrong");
      }
      btn.style.pointerEvents = "none";
    } else if (selectedAnswers[index].includes(i)) {
      btn.classList.add("selected");
    }

    btn.addEventListener("click", () => toggleAnswer(i));
    optionsEl.appendChild(btn);
  });

  // Растягиваем последнюю кнопку, если нечётное кол-во
  if (q.options.length % 2 !== 0) {
    optionsEl.lastElementChild.classList.add("wide-option");
  }

  // Управление видимостью и расположением кнопок "Назад" и "Вперёд"
  if (index === 0) {
    prevBtn.style.visibility = "hidden";
    nextBtn.style.order = "1";
  } else {
    prevBtn.style.visibility = "visible";
    nextBtn.style.order = "0";
  }

  // Обновляем кнопки, блокируем если автопереход
  prevBtn.disabled = isAutoAdvancing;
  nextBtn.disabled = isAutoAdvancing;

  current = index;
}

function toggleAnswer(i) {
  if (isAutoAdvancing) return;

  const q = questions[current];
  const sel = selectedAnswers[current];
  const maxSelect = q.correct.length;

  if (answeredQuestions.has(current)) return;

  const indexInSel = sel.indexOf(i);
  if (indexInSel > -1) {
    sel.splice(indexInSel, 1);
  } else {
    if (sel.length < maxSelect) sel.push(i);
  }

  showQuestion(current);

  if (sel.length === maxSelect) {
    // Подсветка и проверка
    const correctSet = new Set(q.correct);
    const isCorrect = sel.length === q.correct.length && sel.every(a => correctSet.has(a));

    if (isCorrect) {
      correctCount++;
      document.getElementById("correctSound").play();
    } else {
      document.getElementById("wrongSound").play();
    }

    answeredQuestions.add(current);
    showQuestion(current);

    if (navigator.vibrate) navigator.vibrate(200);

    isAutoAdvancing = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;

    setTimeout(() => {
      isAutoAdvancing = false;
      prevBtn.disabled = false;
      nextBtn.disabled = false;
      if (current < questions.length - 1) {
        showQuestion(current + 1);
      } else {
        quizEl.style.display = "none";
        resultEl.style.display = "block";
        scoreText.textContent = `Ваш результат: ${correctCount} / ${questions.length}`;
      }
    }, 3000);
  }
}

function nextQuestion() {
  if (isAutoAdvancing) return;
  if (current < questions.length - 1) {
    showQuestion(current + 1);
  }
}

function prevQuestion() {
  if (isAutoAdvancing) return;
  if (current > 0) {
    showQuestion(current - 1);
  }
}

function restartQuiz() {
  current = 0;
  selectedAnswers = new Array(questions.length).fill(null).map(() => []);
  answeredQuestions.clear();
  correctCount = 0;
  isAutoAdvancing = false;
  quizEl.style.display = "block";
  resultEl.style.display = "none";
  showQuestion(0);
}

function showFinalTable() {
  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const popup = document.createElement("div");
  popup.className = "popup-content";

  const table = document.createElement("table");
  const header = document.createElement("tr");
  ["#", "Вопрос", "Ваш ответ", "Правильный ответ"].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    header.appendChild(th);
  });
  table.appendChild(header);

  questions.forEach((q, i) => {
    const row = document.createElement("tr");

    const num = document.createElement("td");
    num.textContent = i + 1;

    const ques = document.createElement("td");
    ques.textContent = q.question;

    const userAns = document.createElement("td");
    userAns.textContent = selectedAnswers[i].map(idx => q.options[idx]).join(", ");

    const correctAns = document.createElement("td");
    correctAns.textContent = q.correct.map(idx => q.options[idx]).join(", ");

    [num, ques, userAns, correctAns].forEach(td => row.appendChild(td));
    table.appendChild(row);
  });

  const closeBtn = document.createElement("button");
  closeBtn.className = "popup-close-btn";
  closeBtn.textContent = "Закрыть";
  closeBtn.onclick = () => document.body.removeChild(overlay);

  popup.appendChild(table);
  popup.appendChild(closeBtn);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

window.addEventListener("DOMContentLoaded", () => {
  showQuestion(0);
  nextBtn.addEventListener("click", nextQuestion);
  prevBtn.addEventListener("click", prevQuestion);
  restartBtn.addEventListener("click", restartQuiz);
  showResultsBtn.addEventListener("click", showFinalTable);
});
