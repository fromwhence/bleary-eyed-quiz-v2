// Removes :focus outline for mouse users

(function(document, window){
	if (!document || !window) {
		return;
	}
	
	var styleText = '::-moz-focus-inner{border:0 !important;}:focus{outline: none !important;';
	var unfocus_style = document.createElement('STYLE');

	window.unfocus = function(){
		document.getElementsByTagName('HEAD')[0].appendChild(unfocus_style);
		document.addEventListener('mousedown', function(){
			unfocus_style.innerHTML = styleText+'}';
		});
		document.addEventListener('keydown', function(){
			unfocus_style.innerHTML = '';
		});
	};

	unfocus.style = function(style){
		styleText += style;
	};

	unfocus();
})(document, window);

// Main components
const topBar = document.getElementById('topbar');

// Modals and related buttons
const startQuizBtn = document.getElementById('start-btn');
const modal = document.getElementsByClassName('modal')[0];
const endModal = document.getElementsByClassName('modal')[1];
const endModalContent = document.getElementById('end-modal-content');
const closeEndModal = document.getElementById('close-end-modal')
const howToPlay = document.getElementById('how-to-play');
const tryAgainLink = document.getElementById('try-again');
const tryAgainBtn = document.getElementById('try-again-btn');

// Multiple choice data
const celebrityImage = document.getElementById('celebrity-image');
const choicesArr = Array.from(document.getElementsByClassName('choice-text'));
const choiceContainerArr = Array.from(document.getElementsByClassName('choice-container'));
const answerContainer = document.getElementById('answer-items');

// Hud data
const questionCounterText = document.getElementById('question-counter');
const progressBarFull = document.getElementById('progress-bar-full');
const scoreText = document.getElementById('score');
const hudNextArrow = document.getElementById('hud-next-arrow');
const nextBtn = document.getElementById('next-btn');

// End of game data
const finalScore = document.getElementById('final-score');
const endOfGameHeading = document.getElementById('end-heading');
const endOfGameText = document.getElementById('end-paragraph');
const shareLink = document.getElementById('share-link');

// Quiz play variables
let currentQuestion = {};
let questionCounter = 0;
let availbleQuestions = [];
let availablePoints = 5;
let score = 0;
let blurAmount = 28;

// Quiz content
const questions = [
  {
    celebrity: "images/taylor-swift.jpg",
    choice1: "Haley Bennett",
    choice2: "Taylor Swift",
    choice3: "Leelee Sobieski",
    choice4: "Shailene Woodley",
    choice5: "Jennifer Lawrence",
    answer: "Taylor Swift"
  },
  {
    celebrity: "images/keanu-reeves.jpg",
    choice1: "Roman Reigns",
    choice2: "Jack Matthews",
    choice3: "Jason Momoa",
    choice4: "Russell Brand",
    choice5: "Keanu Reeves",
    answer: "Keanu Reeves"
  },
  { 
    celebrity: "images/sofia-vergara.jpg",
    choice1: "Jennifer Lopez",
    choice2: "Sofía Vergara",
    choice3: "Jessica Alba",
    choice4: "Salma Hayek",
    choice5: "Penélope Cruz",
    answer: "Sofía Vergara"
  },
  {
    celebrity: "images/nicki-minaj-2.jpg",
    choice1: "Cardi B",
    choice2: "Nicki Minaj",
    choice3: "Raven Symoné",
    choice4: "Kylie Jenner",
    choice5: "Zendaya",
    answer: "Nicki Minaj"
  },
  {
    celebrity: "images/johnny-depp.jpg",
    choice1: "Robert Downey Jr.",
    choice2: "Omar Metwally",
    choice3: "Hugh Jackman",
    choice4: "Johnny Depp",
    choice5: "Jeffery Dean Morgan",
    answer: "Johnny Depp"

  },
  {
    celebrity: "images/elijah-wood.png",
    choice1: "Elijah Wood",
    choice2: "Daniel Radcliffe",
    choice3: "Liam Hemsworth",
    choice4: "Tobey Maguire",
    choice5: "Justin Timberlake",
    answer: "Elijah Wood"
  },
  {
    celebrity: "images/rihanna-2.jpg",
    choice1: "Rihanna",
    choice2: "Megan Fox",
    choice3: "Cardi B",
    choice4: "Beyoncé",
    choice5: "Ally Brooke",
    answer: "Rihanna"
  },
  {
    celebrity: "images/anthony-mackie.jpg",
    choice1: "Anthony Mackie",
    choice2: "Don Cheadle",
    choice3: "Jamie Foxx",
    choice4: "Idris Elba",
    choice5: "Michael B. Jordan",
    answer: "Anthony Mackie"
  },
  {
    celebrity: "images/selena-gomez.jpg",
    choice1: "Selena Gomez",
    choice2: "Victoria Justice",
    choice3: "Ariana Grande",
    choice4: "Camila Cabello",
    choice5: "Elizabeth Gillies",
    answer: "Selena Gomez"
  },
  {
    celebrity: "images/henry-golding.jpg",
    choice1: "Steven Yeun",
    choice2: "Harry Shum Jr.",
    choice3: "Henry Golding",
    choice4: "John Cho",
    choice5: "Daniel Henney",
    answer: "Henry Golding"
  },
];

const maxQuestions = questions.length;
const maxScore = maxQuestions * 5;

// Add box-shadow to topbar when scrolling
const topbarHeight = topbar.offsetHeight;
console.log(topbarHeight);

addShadowOnScroll = () => {
  topBar.classList.add('scroll-shadow')
}
removeShadow = () => { 
  topBar.classList.remove('scroll-shadow')
}

window.addEventListener('scroll', function() { 
  scrollPosition = window.scrollY;
  if (scrollPosition >= topbarHeight) { 
    addShadowOnScroll();
  }
  else { 
    removeShadow();
  }
})

scrollToTop = () => {
  window.scroll({
    top: 0,
    behavior: 'smooth'
  });
  removeShadow();
}

imageTransition = () => {
  celebrityImage.classList.add('fade-in');
  setTimeout(function(){ 
    celebrityImage.classList.remove('fade-in');
  }, 1000);
  celebrityImage.style.opacity = 1;
}

activateNextButton = () => {
  hudNextArrow.classList.add('active');
  nextBtn.classList.add('active');
}

deactivateNextButton = () => {
  hudNextArrow.classList.remove('active');
  nextBtn.classList.remove('active');
}

startQuiz = () => {
  startQuizBtn.addEventListener('click', scrollToTop);
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions]
  getNewQuestion();
  imageTransition();
  scrollToTop();
}

resetNextQuestion = () => {
  for (let i = 0; i < choiceContainerArr.length; i++) {
    choiceContainerArr[i].classList.remove('correct', 'incorrect', 'inactive');
    choiceContainerArr[i].lastElementChild.classList.remove('inactive');
  }
  deactivateNextButton();
  answerContainer.style.pointerEvents = 'auto';
}

inactivateNames = () => {
  for (let i = 0; i < choiceContainerArr.length; i++)
    if (!choiceContainerArr[i].classList.contains('correct', 'incorrect')) {
    choiceContainerArr[i].classList.add('inactive');
}};

shuffleNames = (names) => {
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = names[i];
    names[i] = names[j];
    names[j] = temp;
  }
  return names;
}

getNewQuestion = () => {
  resetNextQuestion();
  questionCounter++;
  progressBarFull.style.width = `${(questionCounter / maxQuestions) * 100}%`;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];

  let choicesToShuffle = [];
  for (let i = 0; i < choicesArr.length; i++) {
    const number = choicesArr[i].dataset['number'];
    choicesToShuffle.push(choicesArr[i].textContent = currentQuestion['choice' + number]);
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
}

choicesArr.forEach(choice => {
  choice.addEventListener('click', e => {
    e.preventDefault;
    const selectedChoice = e.target;
    let classToApply = 'incorrect';
    if (selectedChoice.textContent === currentQuestion.answer) {
      classToApply = 'correct';
    }
    selectedChoice.parentElement.classList.add(classToApply);

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

    if (classToApply === 'incorrect' &&  blurAmount === 0) {
      incrementScore(availablePoints);
      activateNextButton();
      scrollToTop();
      let choices = document.getElementsByClassName('choice-container');
      const choicesArr = [...choices];
      console.log(choicesArr);
        for (let i = 0; i < choicesArr.length; i++) {
          if (choicesArr[i].classList.contains !== 'incorrect') {
            choicesArr[i].classList.add('correct');
          }
        }
    }

    if (classToApply === 'incorrect' &&  blurAmount === 0 && availableQuestions.length == 0) {
      lastQuestion();
    }

    if (classToApply === 'correct' && availableQuestions.length == 0) {
      lastQuestion();
      inactivateNames();
    }
  });
});

startQuizBtn.addEventListener('click', function() {
  modal.classList.remove('active');
});
howToPlay.addEventListener('click', function() {
  modal.classList.add('active');
  startQuizBtn.textContent = 'Resume';
})
closeEndModal.addEventListener('click', function() {
  endModal.classList.remove('active');
  endModalContent.classList.remove('active');
})
hudNextArrow.addEventListener('click', getNewQuestion);
nextBtn.addEventListener('click', getNewQuestion);

incrementScore = availablePoints => {
  score += availablePoints;
  scoreText.innerHTML = `Score:&nbsp; ${score}/${maxScore}`;
};

lastQuestion = () => {
  hudNextArrow.classList.remove('active');
  howToPlay.classList.remove('active');
  tryAgainLink.classList.add('active');
  nextBtn.classList.remove('active');
  window.setTimeout(endQuizModal, 2000);
}

endQuizModal = () => {
  endModal.classList.add('active');
  endModalContent.classList.add('active');
  finalScore.innerHTML = `${score}/${maxScore}`;
  if (score >= (maxScore - 5)) {
    endOfGameHeading.textContent = 'Excellent job!';
    endOfGameText.textContent = 'You have a keen eye for celebrities!';
  } else if (score >= (maxScore - 10)) {
    endOfGameHeading.textContent = 'Great job!';
    endOfGameText.textContent = 'You have quite an eye for celebrities!';
  } else if (score >= (maxScore - 15)) {
    endOfGameHeading.textContent = 'Good job!';
    endOfGameText.textContent = 'You sure know your celebrities!';
  } else if (score >= (maxScore - 20)) {
    endOfGameHeading.textContent = 'Not bad!';
    endOfGameText.textContent = 'Thanks for playing!';
  } else {
    endOfGameHeading.textContent = 'Nice try!';
    endOfGameText.textContent = 'You might consider playing again.';
  }
}

tryAgain = () => {
  tryAgainLink.classList.remove('active');
  howToPlay.classList.add('active');
  endModal.classList.remove('active');
  scoreText.innerHTML = `Score:&nbsp; 0/50`;
  startQuiz();
}

tryAgainBtn.addEventListener('click', tryAgain);
tryAgainLink.addEventListener('click', tryAgain);

startQuiz();