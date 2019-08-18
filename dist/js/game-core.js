var colors = [
  { polish: "czerwony", english: "red", backgroundColor: "rgb(255, 51, 51)" },
  { polish: "żółty", english: "yellow", backgroundColor: "rgb(255, 255, 0)" },
  { polish: "niebieski", english: "blue", backgroundColor: "rgb(0, 0, 255)" },
  { polish: "zielony", english: "green", backgroundColor: "rgb(0, 128, 0)" },
  { polish: "różowy", english: "pink", backgroundColor: "rgb(255, 192, 203)" },
  {
    polish: "pomarańczowy",
    english: "orange",
    backgroundColor: "rgb(255, 165, 0)"
  },
  {
    polish: "fioletowy",
    english: "violet",
    backgroundColor: "rgb(238, 130, 238)"
  },
  { polish: "biały", english: "white", backgroundColor: "rgb(255, 255, 255)" },
  { polish: "czarny", english: "black", backgroundColor: "rgb(0, 0, 0)" },
  { polish: "szary", english: "gray", backgroundColor: "rgb(128, 128, 128)" },
  { polish: "brązowy", english: "brown", backgroundColor: "rgb(139, 69, 19)" }
];

var circles = document.getElementsByClassName("circle");
var answer = document.getElementById("answer");
var score = document.getElementById("score");
var timer = document.getElementById("timer");
var btnNext = document.getElementById("next");
var btnStart = document.getElementById("start");
var gameDisplay = document.getElementById("game");
var lowerSection = document.getElementById("lowerSection");
var endGameScreen = document.getElementById("endGame");
var endMessage = document.getElementById("endMessage");
var endScore = document.getElementById("endScore");
var btnRestart = document.getElementById("btnRestart");
var grade = document.getElementById("grade");
var timeLeft;
var secMultiplier;
var points = 0;
var lifes = 3;
var answerArr = ["rgb(x, y, z)"];
var isClickable = true;
var sndError = new Audio("sound/error.wav");
var sndCorrect = new Audio("sound/correct.wav");

btnStart.addEventListener("click", function() {
  btnStart.style.display = "none";
  gameDisplay.style.display = "block";
  lowerSection.style.display = "block";
  RandomizeQuestion();
  Timer(10);
});

btnNext.addEventListener("click", function() {
  btnNext.style.display = "none";
  RandomizeQuestion();
  Timer(10);
  Answer(90, 0);
});

btnRestart.addEventListener("click", function() {
  Timer(10);
  RestartGame();
});

function ResetColors() {
  for (var i = 0; i < circles.length; i++) {
    circles[i].style.backgroundColor = "transparent";
  }
}

function RandomColor() {
  var randomNr = Math.floor(Math.random() * colors.length);
  return colors[randomNr].backgroundColor;
}

function RandomizeColors() {
  var randomColor = RandomColor();
  for (var i = 0; i < circles.length; i++) {
    if (circles[i].style.backgroundColor == randomColor) {
      randomColor = RandomColor();
      i = -1;
    } else if (circles[i].style.backgroundColor == "transparent") {
      circles[i].style.backgroundColor = randomColor;
      randomColor = RandomColor();
      i = -1;
    }
  }
}

function RandomizeAnswer() {
  var pickedColor =
    circles[Math.floor(Math.random() * circles.length)].style.backgroundColor;
  for (var i = 0; i < answerArr.length; i++) {
    if (answerArr.length == colors.length) {
      EndGame();
      break;
    }
    if (pickedColor == answerArr[i]) {
      ResetColors();
      RandomizeColors();
      i = -1;
      pickedColor =
        circles[Math.floor(Math.random() * circles.length)].style
          .backgroundColor;
    }
  }
  for (var j = 0; j < colors.length; j++) {
    if (pickedColor == colors[j].backgroundColor) {
      answer.innerHTML = colors[j].english;
      answerArr.push(pickedColor);
      break;
    }
  }
}

function Timer(seconds) {
  clearInterval(timeLeft);
  const now = Date.now();
  const then = now + seconds * 1000;
  DisplayTimeLeft(seconds);

  timeLeft = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    secMultiplier = secondsLeft / 2;
    if (secondsLeft < 0) {
      Answer(0, 90);
      clearTimeout(timeLeft);
      btnNext.style.display = "block";
      Incorrect();
      return;
    }
    DisplayTimeLeft(secondsLeft);
  }, 1000);
}

function DisplayTimeLeft(seconds) {
  timer.innerHTML = "czas: " + seconds + "s";
}

function AddPoints() {
  if (typeof secMultiplier == "undefined") {
    secMultiplier = Math.floor(10 / 2);
    points += secMultiplier * 100;
    score.innerHTML = "wynik: " + points;
    secMultiplier = undefined;
  } else {
    points += secMultiplier * 100;
    score.innerHTML = "wynik: " + points;
    secMultiplier = undefined;
  }
}

function RandomizeQuestion() {
  ResetColors();
  RandomColor();
  RandomizeColors();
  RandomizeAnswer();
}

function Answer(from, to) {
  for (var i = 0; i < circles.length; i++) {
    circles[i].animate(
      [
        // keyframes
        { transform: "rotateY(" + from + "deg)" },
        { transform: "rotateY(" + to + "deg)" }
      ],
      {
        // timing options
        duration: 500,
        iterations: 1,
        fill: "forwards"
      }
    );
  }
}

function Incorrect() {
  var heart = document.getElementById("heart-" + lifes);
  heart.classList.add("shakeAnimation");
  sndError.play();
  setTimeout(function() {
    heart.style.display = "none";
    heart.classList.remove("shakeAnimation");
  }, 500);
  lifes--;
  {
    if (lifes <= 0) {
      EndGame(lifes);
    }
  }
}

function EndGame() {
  gameDisplay.style.display = "none";
  lowerSection.style.display = "none";
  endGameScreen.style.display = "block";
  if (lifes > 0) {
    endMessage.innerHTML = "Wygrałeś!!! </br> Twój wynik to: ";
  } else {
    endMessage.innerHTML = "Nie poddawaj się </br> Twój wynik to: ";
  }
  endScore.innerHTML = points + lifes * 250;
  Answer(90, 0);
}

function RestartGame() {
  gameDisplay.style.display = "block";
  lowerSection.style.display = "block";
  endGameScreen.style.display = "none";
  lifes = 3;
  points = 0;
  answerArr = ["rgb(x, y, z)"];
  for (var i = 3; i >= 1; i--) {
    document.getElementById("heart-" + i).style.display = "block";
  }
  RandomizeQuestion();
  Timer(10);
  btnNext.style.display = "none";
  score.innerHTML = "wynik: 0";
}

for (var i = 0; i < circles.length; i++) {
  circles[i].addEventListener("click", function() {
    for (var i = 0; i < colors.length; i++) {
      if (answer.innerHTML == colors[i].english) {
        if (
          this.style.backgroundColor == colors[i].backgroundColor &&
          isClickable
        ) {
          Answer(0, 90);
          AddPoints();
          clearTimeout(timeLeft);
          btnNext.style.display = "block";
          isClickable = false;
          sndCorrect.play();
          setTimeout(function() {
            isClickable = true;
          }, 500);
        } else if (
          this.style.backgroundColor != colors[i].backgroundColor &&
          isClickable
        ) {
          Answer(0, 90);
          btnNext.style.display = "block";
          clearTimeout(timeLeft);
          Incorrect();
          isClickable = false;
          setTimeout(function() {
            isClickable = true;
          }, 500);
        }
      }
    }
  });
}
