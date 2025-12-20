var synth = window.speechSynthesis;

var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('.txt');
var voiceSelect = document.querySelector('select');

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');

var voices = [];

function populateVoiceList() {
  let voicesall = speechSynthesis.getVoices();

  console.log(voicesall);
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

  console.log(voices);
  //return voices;
  var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = '';
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(){
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (inputTxt.value !== '') {
    var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        
        break;
      }
    }
    utterThis.lang = "ko-KR";
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
    console.log(utterThis);
    
  }
}

inputForm.onsubmit = function(event) {
  event.preventDefault();

  speak();

  inputTxt.blur();
}

pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
}

rate.onchange = function() {
  rateValue.textContent = rate.value;
}

voiceSelect.onchange = function(){
  speak();
}
