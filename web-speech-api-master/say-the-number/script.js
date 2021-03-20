var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var phrasePara = document.querySelector('.phrase');
var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');

var testBtn = document.querySelector('button');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}



function koreanwordNumber(number) {

  var shipInt  = 10;
  var baekInt  = 100;
  var choenInt = 1000;
  var manInt   = 10000;

  Number.prototype.format = function(){
    
    var numberWordIndex = ["공", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];

    var numberIndex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];    
    
    var man = this.toString().replace(/(\d)(?=(\d{4})+(?!\d))/g, "$1만");
    var choen = man.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1천");
    var beak = choen.toString().replace(/(\d)(?=(\d{2})+(?!\d))/g, "$1백");
    var ship = beak.toString().replace(/(\d)(?=(\d{1})+(?!\d))/g, "$1십");

    //console.log(ship);
    
    var wordNumbers = ship.toString();
    var i;
    for (i = 0; i < wordNumbers.length; i++) {
      var number = wordNumbers.substring(i, i+1);

      if (numberIndex.includes(number)) {
        var wordNumbers = wordNumbers.toString().replace(number, numberWordIndex[number]);
      };
    }

    var wordNumbers = wordNumbers.toString().replace(/일(만|천|백|십)/g, "$1");
    var wordNumbers = wordNumbers.toString().replace(/공(만|천|백|십)/g, "");
    var wordNumbers = wordNumbers.toString().replace("공", "");

    return wordNumbers;
 };

  numberWord = number.format();


  console.log(numberWord);

  return numberWord;
}

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = 'Test in progress';


  //var phrase = phrases[randomPhrase()];

  var randomNumber = getRandomInt(999) + 1;
  var phrase = koreanwordNumber(randomNumber);

  // To ensure case consistency while checking with the returned output text
  //phrase = phrase.toLowerCase();
  phrasePara.textContent = randomNumber;
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
	
    if(speechResults.includes(phrase) || speechResults.includes(randomNumber.toString())/*speechResult === phrase*/) {
      resultPara.textContent = 'I heard the correct phrase!';
      resultPara.style.background = 'lime';
    } else {
      resultPara.textContent = 'That didn\'t sound right.';
      resultPara.style.background = 'red';
    }
    console.log('Confidence: ' + event.results[0][0].confidence);
	
	var eventResults = event.results;
	
	console.log(eventResults);
	
	
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
