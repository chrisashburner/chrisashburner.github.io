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

function cardSpeechMatch(speech, card) {
	//
	console.log(speech, card);
}



function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
 
  var different = firstCard.firstElementChild.id.substring(2, 1) !== secondCard.firstElementChild.id.substring(2, 1);

  if (different) {
	  prompt.style.visibility = "visible";
	  
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
		speechPrompt.style.visibility = "visible";
		recognition.start();		
		
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

/*let allVoices;

function init(){
  if (window.speechSynthesis) {
    if (speechSynthesis.onvoiceschanged !== undefined) {
      //Chrome gets the voices asynchronously so this is needed
      speechSynthesis.onvoiceschanged = setUpVoices;
    }
    setUpVoices(); //for all the other browsers
  }else{
    speakBtn.disabled = true;
    speakerMenu.disabled = true;
    qs("#warning").style.display = "block";
  }
}

function setUpVoices(){
	//actuall just Korean Google Voice
  allVoices = getAllVoices();
}

function getAllVoices() {
  let voicesall = speechSynthesis.getVoices();
  let vuris = [];
  let voices = [];
  voicesall.forEach(function(obj,index){
    let uri = obj.voiceURI;
	
    if (!vuris.includes(uri) && obj.lang == "ko-KR" && obj.voiceURI.includes("Google")){
      vuris.push(uri);
      voices.push(obj);
    }
  });
  voices.forEach(function(obj,index){obj.id = index;});
  return voices;
}

function talk(text){
  //let sval = Number(speakerMenu.value); //14 Korean 
  let u = new SpeechSynthesisUtterance();
  u.voice = allVoices[0]; //sval
  u.lang = u.voice.lang;
  u.text = text //txtFld.value;
  u.rate = 0.8;
  speechSynthesis.speak(u);
}

document.addEventListener('DOMContentLoaded', function (e) {
  try {init();} catch (error){
    console.log("Data didn't load", error);}
});


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

/*recognition.onresult = function(event) {
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
}*/

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

/*var phrases = [
  'I love to sing because it\'s fun',
  'where are you going',
  'can I call you tomorrow',
  'why did you talk while I was talking',
  'she enjoys reading books and playing games',
  'where are you going',
  'have a great day',
  'she sells seashells on the seashore'
];*/

var i;
var phrases = [];
for (i = 0; i < JSON_data.length; i++) {
  var word = JSON_data[i]["korean"];
  phrases.push(word);
}

var phrasePara = document.querySelector('.phrase');
var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');

var testBtn = document.querySelector('button');

function randomPhrase() {
  var number = Math.floor(Math.random() * phrases.length);
  return number;
}

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = 'Test in progress';

  var phrase = phrases[randomPhrase()];
  // To ensure case consistency while checking with the returned output text
  phrase = phrase.toLowerCase();
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
  recognition.maxAlternatives = 1;

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
    if(speechResult === phrase) {
      resultPara.textContent = 'I heard the correct phrase!';
      resultPara.style.background = 'lime';
    } else {
      resultPara.textContent = 'That didn\'t sound right.';
      resultPara.style.background = 'red';
    }

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
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

testBtn.addEventListener('click', testSpeech);
