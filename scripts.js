//todo: cards should fold into stack off side of table to remove clutter

//Let's check if stt can be complete
try {
  webkitSpeechRecognition;
  var webkitSpeechRecognitionAvailable = true;
}
catch(err) {
  var webkitSpeechRecognitionAvailable = false;
}

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
	  prompt.classList.remove("invisible");
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
var prompt = document.querySelector("#prompt");

var speechPrompt = document.querySelector(".speechPrompt");
var doneButton = document.querySelector(".done");
var retryButton = document.querySelector(".retry");

yesButton.addEventListener('click', yes);
noButton.addEventListener('click', no);

doneButton.addEventListener('click', done);
retryButton.addEventListener('click', retry);


function retry() {
	var koreanCardWord = firstCard.children[0].alt + secondCard.children[0].alt;
  speechToText(koreanCardWord);	
}

function done() {
	console.log("Done");
  speechPrompt.classList.add("invisible");
	
  var koreanCardWord = firstCard.children[0].alt + secondCard.children[0].alt;
	
	if (resultPara.textContent == 'I heard the correct phrase!') {
		isMatch = true;
		increasePlayerScore(5, playerTurn);
	}	else {
		isMatch = false;
	}
	
	isMatch ? disableCards() : unflipCards();
	changePlayerTurn();
	
}

function yes() {
	console.log("Yes");
	prompt.classList.add("invisible");
	
	let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
	
	if (isMatch) {

    if (webkitSpeechRecognitionAvailable) {
		  speechPrompt.classList.remove("invisible");
      var koreanCardWord = firstCard.children[0].alt + secondCard.children[0].alt;
      speechToText(koreanCardWord);
    } else {
      increasePlayerScore(5, playerTurn);
      isMatch ? disableCards() : unflipCards();
	    changePlayerTurn();
    }
		
	} else {
		increasePlayerScore(1, otherPlayer);
		isMatch ? disableCards() : unflipCards();
		changePlayerTurn();
	}
	
	
}

function no() {
	console.log("No");
	prompt.classList.add("invisible");
	
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

  if (JSON_data[i]["image"] == "") {
    var englishWord = JSON_data[i]["english"];
    englishWord = englishWord.replace(/,\s/, ',\n');

    var data = textImage.toDataURL(englishWord);
    document.getElementById(String.fromCharCode(97 + i) + "2").src = data;
  } else

  {
    document.getElementById(String.fromCharCode(97 + i) + "2").src = JSON_data[i]["image"];
  }
  

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

if (webkitSpeechRecognitionAvailable) {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;


  var phrasePara = document.querySelector('.phrase');
  var resultPara = document.querySelector('.result');
  var diagnosticPara = document.querySelector('.output');

}


function speechToText(phrase) {
  doneButton.disabled = true;
  retryButton.disabled = true;
  retryButton.textContent = 'Test in progress';

  phrasePara.textContent = phrase;
  resultPara.textContent = 'Right or wrong?';
  resultPara.style.background = 'rgba(0,0,0,0.2)';
  diagnosticPara.textContent = '...diagnostic messages';

  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'ko-KR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 5;

  recognition.start();

  recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object 
    var speechResult = event.results[0][0].transcript.toLowerCase();
    diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';
	
	var i;
	var speechResults = [];
	
	for (i = 0; i < event.results[0].length; i++) {
	  var word = event.results[0][i].transcript;
	  speechResults.push(word);
	}
	console.log(speechResults);

    var matchArray = findBestMatch(phrase, speechResults);
    console.log('match');
    console.log(matchArray);
    console.log(matchArray["_text"]);
    console.log(matchArray["similarity"]);

    diagnosticPara.textContent = 'Speech received: ' + matchArray["_text"] + '.';
	
    if(matchArray["similarity"] >= 0.6) {
      resultPara.textContent = 'I heard the correct phrase!';
      resultPara.style.background = 'lime';
    } else {
      resultPara.textContent = 'That didn\'t sound right.';
      resultPara.style.background = 'red';
    }
    console.log('Confidence: ' + event.results[0][0].confidence);
	
	var eventResults = event.results;
	
	console.log(eventResults);

  if (resultPara.textContent == 'I heard the correct phrase!') {
    retryButton.disabled = true;
  }
	
	
  }

  recognition.onspeechend = function() {
    recognition.stop();
    
    if (resultPara.textContent == 'I heard the correct phrase!') {
      retryButton.disabled = true;
    } else {
      retryButton.disabled = false;
    }
    doneButton.disabled = false;
    retryButton.textContent = 'Retry';
  }

  recognition.onerror = function(event) {
    retry.disabled = false;
    done.disabled = false;
    retry.textContent = 'Retry';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }
  
  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }
  
  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }
  
  recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
  }
  
  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }
  
  recognition.onsoundstart = function(event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }
  
  recognition.onsoundend = function(event) {
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }
  
  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
  }
}