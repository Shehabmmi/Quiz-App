// `https://opentdb.com/api.php?amount=3&category=9&difficulty=medium&type=multiple`


let myForm = document.querySelector("form");
let categoryMenu = document.getElementById("categoryMenu");
let difficultyOptions = document.getElementById("difficultyOptions");
let questionsNumber = document.getElementById("questionsNumber");
let typeQuestions = document.getElementById('typeQuestions')
let myQuiz;
let allQestions;
let myRow = document.querySelector(".questions .container .row");

myForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let category = categoryMenu.value;
  let difficulty = difficultyOptions.value;
  let number = questionsNumber.value;
  let type = typeQuestions.value;

  myQuiz = new Quiz(category, difficulty, number , type);
  myQuiz.getApi();
  allQestions = await myQuiz.getAllQuestions();
  console.log(allQestions);

  let myQuestion = new Question(0);
  console.log(myQuestion);

  myForm.classList.replace("d-flex", "d-none");

  myQuestion.displayQuestions();
});

class Quiz {
  constructor(category, difficulty, number , type) {
    this.category = category;
    this.difficulty = difficulty;
    this.number = number;
    this.type = type
    this.score = 0;
  }

  getApi() {
    // `https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple`
    return `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}&type=${this.type}`;
  }

  async getAllQuestions() {
    let response = await fetch(this.getApi());
    let data = await response.json();
    return data.results;
  }

  showResult() {
    return `
    <div
        class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 bg-white mt-3">
        <h2 class="mb-0 "> ${this.score == this.number ? 'Congratulations 🎉'   :  `Your score is ${this.score}`}</h2>
        <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
      </div>
    `;
  }
}

class Question {
  constructor(index) {
    this.index = index;
    this.question = allQestions[index].question;
    this.correct_answer = allQestions[index].correct_answer;
    this.incorrect_answers = allQestions[index].incorrect_answers;
    this.category = allQestions[index].category;
    this.allAnswer = this.getAllAnswers();
    this.isAnswerd = false;
  }

  getAllAnswers() {
    let allAnswer = [...this.incorrect_answers, this.correct_answer];
    allAnswer.sort();
    return allAnswer;
  }

  displayQuestions() {
    let cartona = `
        <div class="question shadow-lg col-lg-6 offset-lg-3 mt-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn bg-white">
<div class="w-100 d-flex justify-content-between">
  <span class="btn btn-category">${this.category}</span>
  <span class="fs-6 btn btn-questions"> ${this.index + 1} of ${
      allQestions.length
    } Questions</span>
</div>
<h2 class="text-capitalize h4 text-center">${this.question}</h2>  
<ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center gap-3">
  ${this.allAnswer.map((li) => `<li class="myList">${li}</li>`).join("")}
</ul>
<h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score:${
      myQuiz.score
    }</h2>        
</div>
      `;
    myRow.innerHTML = cartona;

    let allChoices = document.querySelectorAll(".choices li");
    allChoices.forEach((li) => {
      li.addEventListener("click", () => {
        this.checkAnswers(li);
        this.nextQuestion();
      });
    });
  }

  checkAnswers(li) {
    if (this.isAnswerd == false) {
      this.isAnswerd = true;
      if (li.innerHTML == this.correct_answer) {
        li.classList.add("correct", "animate__animated", "animate__bounce");
        myQuiz.score++;
      } else {
        li.classList.add("wrong", "animate__animated", "animate__shakeX");
      }
    }
  }

  nextQuestion() {
    this.index++;

    setTimeout(() => {
      if (this.index < allQestions.length) {
        let myNewQuestion = new Question(this.index);
        myNewQuestion.displayQuestions();
      } else {
        let result = myQuiz.showResult()
        myRow.innerHTML = result;
        document.querySelector('.again').addEventListener('click' , ()=>{
          window.location.reload()
        })
      }
    }, 1500);
  }
}
