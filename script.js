// Get instance of speechRecognition
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');
var testBtn = document.querySelector('button');

function searchTerm(speech) {
    /* TODO search the web for the given input
     */
}

function openSite(speech) {
    /* TODO implement the functionality to open
     * a website based on user input.
     * Pass the speech to searchTerm if the website is not in list
     * or is not in the form of <websitename>.<domainname>
     */
}

function greeting(speech) {
    /* TODO give appropriate responses for varioius greetings
     */
}

function parseSpeech(speech) {
    // Check if speech is a question
    var questionKeywords = ['who', 'what', 'when', 'where', 'why', 'how', 'is', 'can', 'does', 'do'];
    for (var i = 0; i < questionKeywords.length; i++) {
        if(speech.indexOf(questionKeywords[i]) != -1) {
            searchTerm(speech);
            return;
        }
    }
    // Check if speech is a command to open website
    var openKeywords = ['open', 'navigate', 'browse', 'take', 'show'];
    for (var i = 0; i < openKeywords.length; i++) {
        if(speech.indexOf(openKeywords[i]) != -1) {
            openSite(speech);
            return;
        }
    }
    // Star Wars Easter Egg
    if(speech === "hello there") {
        diagnosticPara.textContent = 'General Kenobi, You are a bold one!';
        return;
    }
    // Check if speech is a greeting
    var greetKeywords = ['hi', 'hello', 'hey'];
    for (var i = 0; i < greetKeywords.length; i++) {
        if(speech.indexOf(greetKeywords[i]) != -1) {
            greeting(speech);
            return;
        }
    }
    // If none of the above conditions are met
    diagnosticPara.textContent = 'Sorry, I can not understand that, yet.';
}

function testSpeech() {
    testBtn.disabled = true;
    testBtn.textContent = 'Listening';

    var recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(event) {
        var speechResult = event.results[0][0].transcript;
        resultPara.textContent = 'Speech Received: ' + speechResult + '.';
        console.log('Confidence: ' + event.results[0][0].confidence);
        parseSpeech(speechResult.toLowerCase());
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
