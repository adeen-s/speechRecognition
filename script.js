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
    /* TODO identify the nature of input,
     * i.e, whether the input is supposed to be a question,
     * a command to open a website,
     * a greeting,
     * or a search term
     */
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
