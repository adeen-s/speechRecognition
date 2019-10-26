// Get instance of speechRecognition
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var synth = window.speechSynthesis;


var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');
var testBtn = document.querySelector('button');
var loader = document.getElementById('loader');
loader.style.visibility = 'hidden';

function searchTerm(speech) {
    var win = window.open("https://www.google.co.in/search?q=" + speech, '_blank');
    synth.speak(new SpeechSynthesisUtterance("Searching Google for " + speech))
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Browser has blocked it
        alert('Please allow popups for this website');
    }
}

function openSite(speech) {
    var words = speech.split(" ");
    for (var i = 0; i < words.length; i++) {
        if (words[i].indexOf(".") != -1) {
            var win = window.open("https://" + words[i], '_blank');
            synth.speak(new SpeechSynthesisUtterance("Now opening " + words[i]))
            if (win) {
                //Browser has allowed it to be opened
                win.focus();
            } else {
                //Browser has blocked it
                synth.speak(new SpeechSynthesisUtterance("Please allow popups"))
                alert('Please allow popups for this website');
            }
            return;
        }
    }
    searchTerm(speech);
}


//Edit contactMe() function according to yourself. 
function contactMe() {
    synth.speak(new SpeechSynthesisUtterance("Sending an email to Adeen"))
    diagnosticPara.textContent = 'Sending an email to Adeen';
	window.open("mailto:adeen@adeen.me");
}

function setTemp(speech){
    var city = "";
    var words = speech.split(" ");
    for (var i=0 ; i<words.length ; ++i){
        if(words[i] == "in") {
            for (var j=i+1 ; j<words.length ; ++j){
                city = city + " " + words[j] ;
            }
        }
    }
    var printTxt = ""
    var searchtext = "select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + city + "') and u='c'"
    $.getJSON("https://query.yahooapis.com/v1/public/yql?q=" + searchtext + "&format=json").success(    function(data){
      console.log(data);
      printTxt = "Temperature in " + city + " is " + data.query.results.channel.item.condition.temp + "°C" ;
      synth.speak(new SpeechSynthesisUtterance(printTxt))
      diagnosticPara.textContent = printTxt;
      });
}

function goodBye(){
    synth.speak(new SpeechSynthesisUtterance("Have a nice day"))
    diagnosticPara.textContent = 'Have a nice day' ;
    window.location.href = "about:blank" ;
}

function greeting(speech) {
    diagnosticPara.textContent = 'Hello! What can I do for you ?';
    synth.speak(new SpeechSynthesisUtterance("Hello! What can I do for you ?"))
}


function parseSpeech(speech) {
    
    //Check if speech is related to weather 
    var tempKeyword = ['temperature' , 'weather'] ;
    for (var i=0 ; i<tempKeyword.length ; ++i){
        if(speech.indexOf(tempKeyword[i]) != -1){
              setTemp(speech);
              return ;
         }
    }

    // Check if speech is a question
    var questionKeywords = ['who', 'what', 'when', 'where', 'why', 'how', 'is', 'can', 'does', 'do', 'search', 'find', 'look'];
    for (var i = 0; i < questionKeywords.length; i++) {
        if(speech.indexOf(questionKeywords[i]) != -1) {
            searchTerm(speech);
            return;
        }
    }
    // Check if speech is a command to open website
    var openKeywords = ['open', 'navigate', 'browse', 'take'];
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
    //Check if speech is a contact request
    var contactKeywords = ['contact' , 'connect' , 'email' , 'help' , 'feedback'];
    for (var i=0 ; i<contactKeywords.length; ++i){
    	if(speech.indexOf(contactKeywords[i]) != -1){
    		contactMe();
    		return ;
    	}
    }
    //Check if user want to leave
    var leaveKeywords = ['good bye' , 'bye' , 'close this tab' , 'dismiss'];
    for (var i=0 ; i<leaveKeywords.length; ++i){
        if(speech.indexOf(leaveKeywords[i]) != -1){
            goodBye();
            return ;
        }
    }

    // If none of the above conditions are met
    diagnosticPara.textContent = 'Sorry, I can not understand that, yet.';
    synth.speak(new SpeechSynthesisUtterance("Sorry! I do not understand that yet"))
}

function testSpeech() {
    testBtn.disabled = true;
    loader.style.visibility = 'visible';
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
        loader.style.visibility = 'hidden';
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
