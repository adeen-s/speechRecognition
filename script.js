var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');

var testBtn = document.querySelector('button');

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = 'Listening';

  var recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  var sitesList = ['twitter', 'reddit', 'facebook', 'youtube'];
  var sitesURL = ['https://twitter.com', 'https://reddit.com', 'https://facebook.com', 'https://youtube.com'];

  recognition.onresult = function(event) {
    var speechResult = event.results[0][0].transcript;
    resultPara.textContent = 'Speech received: ' + speechResult + '.';
    console.log('Confidence: ' + event.results[0][0].confidence);
    if (speechResult.toLowerCase().indexOf("open") != -1) {
        var siteIndex = sitesList.indexOf(speechResult.toLowerCase().slice(5))
        if (siteIndex >= 0) {
            var win = window.open(sitesURL[siteIndex], '_blank');
            if (win) {
                //Browser has allowed it to be opened
                win.focus();
            } else {
                //Browser has blocked it
                alert('Please allow popups for this website');
            }
        }
    }
  }

  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Start Listening';
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Start Listening';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

}

testBtn.addEventListener('click', testSpeech);
