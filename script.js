const PrPr = "Present Perfect"
const FuS = "Future Simple"
const PaS = "Past Simple"
const PaPr = "Past Perfect"
const PaC = "Past Continuous"
const PrS = "Present Simple"
const PrCn = "Present Continuous"
const PrPerCn = "Present Perfect Continuous"
const questions = [
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
  
];

let current = 0;
let selectedAnswers = [];
let correctCount = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const chooseMsgEl = document.getElementById("chooseMsg");
const resultEl = document.getElementById("result");
const quizEl = document.getElementById("quiz");
const scoreText = document.getElementById("scoreText");
const progressText = document.getElementById("progressText");

const correctSound = new Audio("correct.mp3");
const wrongSound = new Audio("wrong.mp3");

function showQuestion(index) {
  const q = questions[index];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  chooseMsgEl.textContent = q.correct.length > 1
    ? `Выберите ${q.correct.length} ответа`
    : "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("div");
    btn.className = "option";
    btn.textContent = opt;
    btn.onclick = () => toggleAnswer(btn, i);
    optionsEl.appendChild(btn);
  });

  if (selectedAnswers[index]) {
    selectedAnswers[index].forEach(i => {
      optionsEl.children[i].classList.add("selected");
    });
  }

  progressText.textContent = `${index + 1} / ${questions.length}`;
  updateNavButtons();
}

function toggleAnswer(el, index) {
  const q = questions[current];
  selectedAnswers[current] = selectedAnswers[current] || [];
  const sel = selectedAnswers[current];

  if (optionsEl.classList.contains("locked")) return;

  if (sel.includes(index)) {
    sel.splice(sel.indexOf(index), 1);
    el.classList.remove("selected");
    return;
  }

  if (sel.length >= q.correct.length) return;

  sel.push(index);
  el.classList.add("selected");

  if (sel.length === q.correct.length) {
    optionsEl.classList.add("locked");
    const options = optionsEl.querySelectorAll(".option");

    sel.forEach((i, idx) => {
      setTimeout(() => {
        const opt = options[i];
        if (q.correct.includes(i)) {
          opt.classList.remove("selected");
          opt.classList.add("correct");
          correctSound.play();
        } else {
          opt.classList.remove("selected");
          opt.classList.add("wrong");
          wrongSound.play();
        }
      }, idx * 500);
    });

    setTimeout(() => {
      options.forEach((opt, i) => {
        if (!sel.includes(i) && q.correct.includes(i)) {
          opt.classList.add("correct");
        }
        opt.style.pointerEvents = "none";
      });
    }, q.correct.length * 500 + 300);

    if (arraysEqual(sel.sort(), q.correct.sort())) correctCount++;

    setTimeout(() => {
      optionsEl.classList.remove("locked");
      nextQuestion();
    }, 4000);
  }
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}

function nextQuestion() {
  if (current < questions.length - 1) {
    current++;
    showQuestion(current);
  } else {
    quizEl.style.display = "none";
    resultEl.style.display = "block";
    scoreText.textContent = `Ваш результат: ${correctCount} / ${questions.length}`;
  }
}

function prevQuestion() {
  if (current > 0) {
    current--;
    showQuestion(current);
  }
}

function updateNavButtons() {
  document.getElementById("prevBtn").style.visibility = current === 0 ? "hidden" : "visible";
}

function restartQuiz() {
  current = 0;
  correctCount = 0;
  selectedAnswers = [];
  quizEl.style.display = "block";
  resultEl.style.display = "none";
  showQuestion(current);
}

function showFinalTable() {
  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const popup = document.createElement("div");
  popup.className = "popup-content";

  const title = document.createElement("h3");
  title.textContent = "Подробные результаты";
  popup.appendChild(title);

  const table = document.createElement("table");
  const header = document.createElement("tr");
  ["#", "Вопрос", "Ваш ответ", "Правильный ответ"].forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    header.appendChild(th);
  });
  table.appendChild(header);

  questions.forEach((q, idx) => {
    const tr = document.createElement("tr");
    const userAns = selectedAnswers[idx] || [];

    const td1 = document.createElement("td");
    td1.textContent = idx + 1;
    const td2 = document.createElement("td");
    td2.textContent = q.question;
    const td3 = document.createElement("td");
    td3.textContent = userAns.map(i => q.options[i]).join(", ");
    const td4 = document.createElement("td");
    td4.textContent = q.correct.map(i => q.options[i]).join(", ");

    [td1, td2, td3, td4].forEach(td => tr.appendChild(td));
    table.appendChild(tr);
  });

  popup.appendChild(table);

  const closeBtn = document.createElement("button");
  closeBtn.className = "popup-close-btn";
  closeBtn.textContent = "Закрыть";
  closeBtn.onclick = () => document.body.removeChild(overlay);
  popup.appendChild(closeBtn);

  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

window.onload = () => showQuestion(current);
