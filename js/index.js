'use strict';

const topBar = document.querySelector('.topbar');
const quizContent = document.getElementById('quiz-content');

// Modals and related buttons
const startQuizBtn = document.querySelector('.start-btn');
const modal = document.querySelector('.modal');
const endModal = document.querySelector('.end-modal');
const endModalContent = document.querySelector('.end-modal-window');
const closeEndModal = document.querySelector('.close-end-modal');
const howToPlay = document.querySelector('.how-to-play');
const tryAgainLink = document.querySelector('.try-again');
const tryAgainBtn = document.querySelector('.try-again-btn');

// Multiple choice data
const celebrityImage = document.querySelector('.celebrity-image');
const choicesArr = Array.from(document.querySelectorAll('.choice-text'));
const choiceContainerArr = Array.from(
  document.querySelectorAll('.choice-container')
);
const answerContainer = document.querySelector('.answer-items');

// Hud data
const questionCounterText = document.querySelector('.question-counter');
const progressBarFull = document.querySelector('.progress-bar-full');
const scoreText = document.querySelector('.score');
const hudNextArrow = document.querySelector('.hud-next-arrow');
const nextBtn = document.querySelector('.next-btn');

// End of game data
const finalScore = document.querySelector('.final-score');
const endOfGameHeading = document.querySelector('.end-heading');
const endOfGameText = document.querySelector('.end-paragraph');
// const shareLink = document.getElementById("share-link");

// Quiz data variables
let currentQuestion = {};
let questionCounter = 0;
let availableQuestions = [];
let availablePoints = 5;
let score = 0;
let blurAmount = 28;

const maxQuestions = questions.length;
const maxScore = maxQuestions * 5;

// Add box-shadow to topbar when scrolling
const topbarHeight = topBar.offsetHeight;

const addShadowOnScroll = () => {
  topBar.classList.add('scroll-shadow');
};
const removeShadow = () => {
  topBar.classList.remove('scroll-shadow');
};

window.addEventListener('scroll', function () {
  const scrollPosition = window.scrollY;
  if (scrollPosition >= topbarHeight) {
    addShadowOnScroll();
  } else {
    removeShadow();
  }
});

// Scroll to top after correct answer on small devices
const topOfPage = document.querySelector('.top');

const scrollToTop = () => {
  topOfPage.scrollIntoView({ behavior: 'smooth' });
  removeShadow();
};

const imageTransition = () => {
  celebrityImage.classList.add('fade-in');
  setTimeout(function () {
    celebrityImage.classList.remove('fade-in');
  }, 1000);
  celebrityImage.style.opacity = 1;
};

const defaultNextButton = () => {
  hudNextArrow.classList.remove('active');
  nextBtn.classList.remove('active');
};
const activateNextButton = () => {
  hudNextArrow.classList.add('active');
  nextBtn.classList.add('active');
};

const startQuiz = () => {
  startQuizBtn.addEventListener('click', scrollToTop);
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  imageTransition();
  scrollToTop();
};

const resetNextQuestion = () => {
  scrollToTop();
  defaultNextButton();
  for (let i = 0; i < choiceContainerArr.length; i++) {
    choiceContainerArr[i].classList.remove('correct', 'incorrect', 'inactive');
    choiceContainerArr[i].lastElementChild.classList.remove('inactive');
  }
  answerContainer.style.pointerEvents = 'auto';
};

// Upon correct answer, gray out incorrect choices.
const inactivateNames = () => {
  for (let i = 0; i < choiceContainerArr.length; i++)
    if (!choiceContainerArr[i].classList.contains('correct', 'incorrect')) {
      choiceContainerArr[i].classList.add('inactive');
    }
};

// Shuffle celebrity names for each question
const shuffleNames = names => {
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = names[i];
    names[i] = names[j];
    names[j] = temp;
  }
  return names;
};

const getNewQuestion = () => {
  resetNextQuestion();
  questionCounter++;
  progressBarFull.style.width = `${(questionCounter / maxQuestions) * 100}%`;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];

  let choicesToShuffle = [];
  for (let i = 0; i < choicesArr.length; i++) {
    const number = choicesArr[i].dataset['number'];
    choicesToShuffle.push(
      (choicesArr[i].textContent = currentQuestion['choice' + number])
    );
  }

  let shuffledNames = shuffleNames(choicesToShuffle);
  for (let i = 0; i < choicesArr.length; i++) {
    choicesArr[i].textContent = shuffledNames[i];
  }

  availableQuestions.splice(questionIndex, 1);
  availablePoints = 5;
  celebrityImage.src = currentQuestion.celebrity;
  blurAmount = 28;
  imageTransition();
  celebrityImage.style.filter = `blur(${blurAmount}px)`;
};

// Celebrity name selection
choiceContainerArr.forEach(choice => {
  choice.addEventListener('click', e => {
    let selectedCeleb = e.target.parentElement;
    console.log(selectedCeleb);
    let selectedCelebName = (selectedCeleb = selectedCeleb.lastElementChild);
    let classToApply = 'incorrect';
    if (selectedCelebName.textContent === currentQuestion.answer) {
      classToApply = 'correct';
      selectedCeleb.parentElement.classList.add(classToApply);
    } else {
      selectedCeleb.parentElement.classList.add(classToApply);
    }

    if (classToApply === 'correct') {
      incrementScore(availablePoints);
      activateNextButton();
      celebrityImage.style.filter = 'blur(0)';
      answerContainer.style.pointerEvents = 'none';
      scrollToTop();
      inactivateNames();
    }

    if (classToApply === 'incorrect') {
      availablePoints--;
      blurAmount -= 7;
      celebrityImage.style.filter = `blur(${blurAmount}px)`;
    }

    if (classToApply === 'incorrect' && blurAmount === 0) {
      incrementScore(availablePoints);
      activateNextButton();
      scrollToTop();
      let choices = document.getElementsByClassName('choice-container');
      const choicesArr = [...choices];
      for (let i = 0; i < choicesArr.length; i++) {
        if (choicesArr[i].classList.contains !== 'incorrect') {
          choicesArr[i].classList.add('correct');
        }
      }
    }

    if (
      classToApply === 'incorrect' &&
      blurAmount === 0 &&
      availableQuestions.length == 0
    ) {
      lastQuestion();
    }

    if (classToApply === 'correct' && availableQuestions.length == 0) {
      lastQuestion();
      inactivateNames();
    }
  });
});

// Hud nav and score display
hudNextArrow.addEventListener('click', getNewQuestion);
nextBtn.addEventListener('click', getNewQuestion);
document.addEventListener('keydown', function (e) {
  if (nextBtn.classList.contains('active') && e.key === 'ArrowRight') {
    getNewQuestion();
  }
});

const incrementScore = availablePoints => {
  score += availablePoints;
  scoreText.innerHTML = `Score: ${score}/${maxScore}`;
};

// Modals
const closeModal = function () {
  modal.classList.remove('active');
};

startQuizBtn.addEventListener('click', function (e) {
  closeModal();
});
howToPlay.addEventListener('click', function () {
  modal.classList.add('active');
  startQuizBtn.textContent = 'Resume';
});
closeEndModal.addEventListener('click', function () {
  closeModal();
});

document.addEventListener('keydown', function (e) {
  if (modal.classList.contains('active') && e.key === 'Escape') {
    closeModal();
  }
});

const endQuizModal = () => {
  endModal.classList.add('active');
  endModalContent.classList.add('active');
  finalScore.innerHTML = `${score}/${maxScore}`;
  if (score >= maxScore - 5) {
    endOfGameHeading.textContent = 'Excellent job!';
    endOfGameText.textContent = 'You have a keen eye for celebrities!';
  } else if (score >= maxScore - 10) {
    endOfGameHeading.textContent = 'Great job!';
    endOfGameText.textContent = 'You have quite an eye for celebrities!';
  } else if (score >= maxScore - 15) {
    endOfGameHeading.textContent = 'Good job!';
    endOfGameText.textContent = 'You sure know your celebrities!';
  } else if (score >= maxScore - 20) {
    endOfGameHeading.textContent = 'Not bad!';
    endOfGameText.textContent = 'Thanks for playing!';
  } else {
    endOfGameHeading.textContent = 'Nice try!';
    endOfGameText.textContent = 'You might consider playing again.';
  }
};

const lastQuestion = () => {
  hudNextArrow.classList.remove('active');
  howToPlay.classList.remove('active');
  tryAgainLink.classList.add('active');
  nextBtn.classList.remove('active');
  window.setTimeout(endQuizModal, 2000);
};

const tryAgain = () => {
  tryAgainLink.classList.remove('active');
  howToPlay.classList.add('active');
  endModal.classList.remove('active');
  scoreText.innerHTML = `Score: 0/50`;
  startQuiz();
  scrollToTop();
};

tryAgainBtn.addEventListener('click', tryAgain);
tryAgainLink.addEventListener('click', tryAgain);

startQuiz();
