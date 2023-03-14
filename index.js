// global variable declaration
let count = 0;
let timer;
let quizData;
let answers = [];

// Dom elements called
let startQuiz = document.querySelector("#startQuiz");
let rulesContainer = document.querySelector("#rulesContainer");
let alertContainer = document.querySelector("#alertContainer");
let submitContainer = document.querySelector("#submitContainer");
let quizContainer = document.querySelector("#quizContainer");
let answersContainer = document.querySelector("#answersContainer");
let displayResult = document.querySelector("#displayResult");

// EventListener for quiz start button
startQuiz.addEventListener("click", () => {
  let countDown = document.querySelector("#countDownContainer");
  let counter = document.querySelector("#counter");
  let counterNum = 2;
  countDown.classList.remove("hidden");
  countDown.classList.add("flex");

  let x = setInterval(() => {
    if (counterNum < 0) {
      coutDown.classList.remove("flex");
      coutDown.classList.add("hidden");
      counterNum = 3;
      count = 0;
      timer = null;
      quizData = null;
      answers = [];
      rulesContainer.classList.add("hidden");
      alertContainer.classList.remove("hidden");
      submitContainer.classList.remove("hidden");
      submitContainer.classList.add("flex");
      loadQuiz();
      quizTimer();
      clearInterval(x);
    }
    counter.innerText = counterNum;
    counterNum--;
  }, 1000);
});

// All quiz data fetched from json
const loadQuiz = async () => {
  const res = await fetch("./data/quiz.json");
  const data = await res.json;
  quizData = data;
  displayQuiz(data);
};

// Displaying quiz on quiz page
const displayQuiz = (data) => {
  if (!data) {
    quizContainer.innerHTML = "";
    return;
  }

  data.forEach((quiz, i) => {
    quizContainer.innerHTML += `<div class="m-3 py-3 px-4 shadow-sm rounded">
  <div class="flex items-center">
    <div class="h-8 w-8 bg-green-300 rounded-full flex justify-center items-center text-green-800 mr-3">
      ${i + 1}
    </div>
    <p class="text-gray-800 text-sm">${quiz.quetion}</p>
  </div>
  <div class="grid grid-cols-2 gap-4 mt-5">
    ${displayQuizOptions(quiz.options, i)}
  </div>
</div>`;
  });
};

// EventListener for quiz submit button
document.querySelector("#submit").addEventlistener("click", () => {
  if (answers.length < 6) {
    return;
  }
  quizTimer(true);
  answersContainer.innerHTML = `<div class="my-4">
  <i class="fa-solid fa-fan animate-spin text-2xl text-green-600"></i>
  <p class="text-xs animate-pulse">Please Wait, We are checking...</p>
</div>`;
  let timeTaken = document.querySelector("#count");
  let totalMark = 0;
  let grade = {
    status: "",
    color: "",
  };

  for (let ans of answers) {
    if (ans.answer === ans.givenAns) {
      totalMark += 10;
    }
  }

  if (totalMark === 60) {
    grade.status = "Excellent";
    grade.color = "text-green-600";
  } else if (totalMark >= 40 && totalMark < 60) {
    grade.status = "Good";
    grade.color = "text-orange-600";
  } else {
    grade.status = "Poor";
    grade.color = "text-red-600";
  }

  // data setting on local storage and getting data from local storage
  let storage = JSON.parse(localStorage.getItem("result"));
  if (storage) {
    localStorage.setItem(
      "results",
      JSON.stringify([
        ...storage,
        {
          marks: totalMark,
          examTime: timeTaken.innerText,
          status: grade.status,
        },
      ])
    );
  } else {
    localStorage.setItem(
      "results",
      JSON.stringify([
        {
          marks: totalMark,
          examTime: timeTaken.innerText,
          status: grade.status,
        },
      ])
    );
  }

  // Right side bar/ answer section
  let x = setTimeout(() => {
    showAnswers(answers);
    displayResult.innerHTML = `<div
    class="h-[220px] w-[220px] mx-auto mt-8 flex flex-col justify-center border-2 rounded-tr-[50%] rounded-bl-[50%]"
  >
    <h3 class="text-xl ${grade.color}">${grade.status}</h3>
    <h1 class="text-3xl font-bold my-2">
      ${totalMark}<span class="text-slate-800">/60</span>
    </h1>
    <p class="text-sm flex justify-center items-center gap-2">
      Total Time: <span class="text-xl text-orange-500">${timeTaken.innerText.replace(
        "sec",
        ""
      )}<span class="text-xs">sec</span></span>
    </p>
  </div>
  
  <button onclick="location.reload();" class="bg-green-600 text-white w-full py-2 rounded mt-16">Restart</button>
  ${
    storage
      ? `<div class="mt-5">
      <h1 class="text-center">Previous Submissions <button class="text-blue-800 text-xs" onclick={localStorage.clear();location.reload()}>Clear History</button></h1>
    <div
    class="flex justify-between items-center border rounded p-2 my-2 shadow-sm font-medium">
    <div>Marks</div>
    <div>Grade</div>
    <div>Time</div>
    </div>
    ${storage
      ?.reverse()
      ?.map(
        (item) => `<div
      class="flex justify-between items-center border rounded p-2 my-2 shadow-sm">
      <div>${item.marks}/60</div>
      <div>${item.status}</div>
      <div>${item.examTime}</div>
      </div>`
      )
      ?.join("")}`
      : ""
  }
  </div>
  `;

    clearTimeout(x);
  }, 1500);
  window.scrollTo(0, 0);
});
