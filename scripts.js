//cards should fold into stack off side of table to remove clutter


const cards = document.querySelectorAll('.memory-card');

let playerOneScore = 0;
let playerTwoScore = 0;
let playerTurn = 1;
let otherPlayer = 2;

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
  if (secondCard) return;
  if (this === firstCard) return;
  
  
  if (this.children[0].alt != "") {
	  talk(this.children[0].alt);  
  }
  
  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  secondCard = this;
  checkForMatch();
}

function changePlayerTurn() {
	if (playerTurn == 1) {
		
		playerTurn = 2;
		otherPlayer = 1;
	} else {
		
		playerTurn = 1;
		otherPlayer = 2;
	}
	
	setTimeout(() => {
		document.getElementById("playerTurnDisplay").innerHTML = "Player " + playerTurn + "'s Turn";
	}, 1500);
}

function increasePlayerScore(points, player) {
	if (player == 1) {
		
		playerOneScore = playerOneScore + points;
		document.getElementById("playerOneScoreDisplay").innerHTML = "Player 1 Score: " + playerOneScore;
	} else {
		
		playerTwoScore = playerTwoScore + points;
		document.getElementById("playerTwoScoreDisplay").innerHTML = "Player 2 Score: " + playerTwoScore;
	}
	
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
 
  var different = firstCard.firstElementChild.id.substring(2, 1) !== secondCard.firstElementChild.id.substring(2, 1);

  if (different) {
	  prompt.style.visibility = "visible";
    lockBoard = true;
	  
  } else {
	  
	  isMatch ? disableCards() : unflipCards();
	  if (isMatch) {increasePlayerScore(5, playerTurn);}
	  changePlayerTurn();
	  
  }  
  
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * (gridSize * 2));
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));

var yesButton = document.querySelector('.yes');
var noButton = document.querySelector('.no');
var prompt = document.querySelector(".prompt");

var speechPrompt = document.querySelector(".speechPrompt");
var doneButton = document.querySelector(".done");
var retryButton = document.querySelector(".retry");

yesButton.addEventListener('click', yes);
noButton.addEventListener('click', no);

doneButton.addEventListener('click', done);
retryButton.addEventListener('click', retry);


function retry() {
	diagnostic.textContent = "try again";
	recognition.start();
	
}

function done() {
	console.log("Done");
	speechPrompt.style.visibility = "hidden";
	
	//let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
	
	/*if (isMatch) {
		increasePlayerScore(5, playerTurn);
		//recognition.start();
				
	} 	*/
	
	var koreanCardWord = firstCard.children[0].alt + secondCard.children[0].alt;
	
	if (koreanCardWord == diagnostic.textContent) {
		isMatch = true;
		increasePlayerScore(5, playerTurn);
	}	else {
		isMatch = false;
	}
	
	isMatch ? disableCards() : unflipCards();
	changePlayerTurn();
	recognition.stop();
	
}

function yes() {
	console.log("Yes");
	prompt.style.visibility = "hidden";
	
	let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
	
	if (isMatch) {
		//speechPrompt.style.visibility = "visible";
		//recognition.start();		
  
		increasePlayerScore(5, playerTurn);
    isMatch ? disableCards() : unflipCards();
	  changePlayerTurn();
	

		
	} else {
		increasePlayerScore(1, otherPlayer);
		isMatch ? disableCards() : unflipCards();
		changePlayerTurn();
	}
	
	
}

function no() {
	console.log("No");
	prompt.style.visibility = "hidden";
	
	let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
	
	if (isMatch) {
		increasePlayerScore(1, otherPlayer);
		isMatch = false;
	}
	
	isMatch ? disableCards() : unflipCards();	
	changePlayerTurn();
}

//Text to Image to create card faces

// create new TextImage object
var textImage = TextImage();

// create new TextImage object with customize style
var style = {
    font: 'courier-new',
    align: 'center',
    color: 'black',
    size: 50,
    //background: 'white',
    //stroke: 1,
    //strokeColor: 'rgba(0, 0, 0, 1)'
};
var textImage = TextImage(style);

//load data into images

JSON_data = JSON.parse(JSON_String).sort(() => Math.random() - Math.random()).slice(0, gridSize);

var i;
for (i = 0; i < JSON_data.length; i++) {
 
  // convert text message to base64 dataURL
  var data = textImage.toDataURL(JSON_data[i]["korean"]);
  document.getElementById(String.fromCharCode(97 + i) + "1").src = data;
  document.getElementById(String.fromCharCode(97 + i) + "1").alt = JSON_data[i]["korean"];

  // convert text message to base64 dataURL
  var data = textImage.toDataURL(JSON_data[i]["english"]);
  document.getElementById(String.fromCharCode(97 + i) + "2").src = data;

}

//Text to Speech
function talk(text){  
  lockBoard = true;
  responsiveVoice.speak(text, 'Korean Female');
  setTimeout(() => {
    lockBoard = false;
  }, 1000);
  
}



//Speech to Text
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var i;
var wordList = [];
for (i = 0; i < JSON_data.length; i++) {
  var word = JSON_data[i]["korean"];
  wordList.push(word);
}

var grammar = '#JSGF V1.0; grammar wordList; public <wordList> = ' + wordList.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'ko-KR';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
//var bg = document.querySelector('html');
//var hints = document.querySelector('.hints');

/*var colorHTML= '';
colors.forEach(function(v, i, a){
  console.log(v, i);
  colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
});*/
//hints.innerHTML = 'Tap/click';

/*document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a word.');
}*/

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  var speechWord = event.results[0][0].transcript;
  //var koreanCardWord = firstCard.children[0].alt + secondCard.children[0].alt;
  diagnostic.textContent = speechWord;//+ ' ' + koreanCardWord + ' match:' + speechWord == koreanCardWord;
  //bg.style.backgroundColor = color;
  console.log(event.results);
  console.log('Confidence: ' + event.results[0][0].confidence);  
  
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that word.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}
