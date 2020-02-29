var questions = []; // Array of objects filled from an external JSON file
var answersDeleted=false; // true if delete answers help is used
var opinionTook = false;  // true if People Opinion help is used
var callMade = false;     // true if call a friend help is used
var q = 0;  // Index of the current question object in the quesrions array of objects
var currentQuestion; // The current question object in the quesrions array of objects
var fIndex; // The first index used to delete two answers help 
var sIndex; // The second index used to delete two answers help
var helpBtns = document.getElementsByClassName("help"); // Three Divs that represent the helpers
var answers = document.getElementsByClassName("answer"); // Four Divs that represent the four answers
var question = document.getElementById("question"); // The Div that holds the question
var score = document.getElementsByTagName("li");    // Array of 14 li represent the score
var scoreIndex = 14; // Index to use in li array of scores
var hideHelpersStyle = "pointer-events: none; opacity: 0.4;"; // Style assigned to the helpers when hidden
var showHelperStyle = "pointer-events: ''; opacity: 1;"; // Style assigned to the helpers when shown
var playerName = getQueryVariable("playerName");

//gets the player's name from the intro page
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1].replace(/\+/g," "));
        }
    }
    console.log('Query variable %s not found', variable);
    }
// Play Intro sound , load data from external JSON file using AJAX and hold for 2 seconds before displaying question and answers
document.body.onload = function () {
    hideElementWithClassName(".help , .answer");
    introQ();
    loadData();
    setTimeout(() => {
        getQuestion();
        showElementWithClassName(".help , .answer");
    }, 2000);
};

// disables divs when answeris clicked ,  still not completely implemented
document.querySelectorAll('.answer').forEach(item => {
    item.addEventListener('click', () => 
    hideElementWithClassName(".help , .answer")
    )
  })

function hideElementWithClassName(className){
    $(className).css("pointer-events", "none")
}
function showElementWithClassName(className){
    $(className).css("pointer-events", "")
}

//loads JSON array of objects  {question,[answers],correctAnswer} .... By Ahmed Ramadan
function loadData() {
    
    var request = new XMLHttpRequest();
    request.open("get", "newData.json", true);
    request.onreadystatechange = function () {
        var PBar = document.getElementById("PBar");
        if (request.readyState == 0) {
            PBar.value = "20";
        } else if (request.readyState == 1) {
            PBar.value = "40";
        } else if (request.readyState == 2) {
            PBar.value = "60";
        } else if (request.readyState == 3) {
            PBar.value = "80";
        } else if (request.readyState == 4 && request.status == 200) {
            PBar.value = "100";
            PBar.style.visibility = "hidden";
            questions = eval("(" + request.responseText + ")");
            resort();  // resort the array of objects to display questions randomly every time the page loads
        }
    }
    request.send();
}

// Resort the array of objects .... By Ahmed Ramadan
function resort() {
    var indexR = 0
    for (let i = 0; i < questions.length; i++) {
        indexR = RandomCreation(i);
        var temp = questions[i];
        questions[i] = questions[indexR];
        questions[indexR] = temp;
    }
}
 //                                 By Ahmed Ramadan
function RandomCreation(index) {
    var x = Math.floor(Math.random() * questions.length);
    if (x <= index) {
        x = RandomCreation();
    }
    return x;
}

// Exit button event .... By Muhammad Essam
document.getElementById("exitbtn").onclick = function(){window.close()};

// Deletes two answers (not the correct answer) .... By Muhammad Essam
document.getElementById("fiftybtn").onclick = function(){
    if(!answersDeleted){
        hideElementWithClassName(".answer");
        deleteAnswerSound();
        setTimeout(() => {
            deleteAnswers();
        }, 11000);
    }
    
};

function deleteAnswers(){
    while(!answersDeleted)
    {
        showElementWithClassName(".answer");
        fIndex = generateRandomNumber(answers.length);
        sIndex = generateRandomNumber(answers.length);      
        if((fIndex != sIndex) &&(answers[fIndex].innerHTML!=questions[q].correct)&&((answers[sIndex].innerHTML!=questions[q].correct)))
        {
            answers[fIndex].style.visibility = "hidden";
            answers[sIndex].style.visibility = "hidden";
            answersDeleted = true;
        }
    }
}

// Hides the Helpers whenever one of them is clicked
document.querySelectorAll('.help').forEach(item => {
    item.addEventListener('click', event => {
        
      hideHelpers();
    })
  })

// Hides Helpers .... By Muhammad Essam
function hideHelpers(){
    for (let index = 0; index < helpBtns.length; index++) {
        helpBtns[index].style = hideHelpersStyle;        
    }
}

// Shows Helpers .... By Muhammad Essam
function showHelpers() {
    if(answersDeleted && callMade){
            helpBtns[2].style = showHelperStyle;        
    }
    else if(opinionTook && callMade){
            helpBtns[0].style = showHelperStyle;        
    }
    else if(opinionTook && answersDeleted){
            helpBtns[1].style = showHelperStyle;        
    }
    else if(answersDeleted){
            helpBtns[1].style = showHelperStyle;        
            helpBtns[2].style = showHelperStyle;        

    }
    else if(callMade){
            helpBtns[0].style = showHelperStyle;        
            helpBtns[2].style = showHelperStyle;        

    }
    else if(opinionTook){
            helpBtns[0].style = showHelperStyle;        
            helpBtns[1].style = showHelperStyle;        

    }
    else
        showElementWithClassName(".help");
}
// returns a random number between  0 and num
function generateRandomNumber(num)
{
    return Math.floor(Math.random()*(num-1));
}

//Loads Question and Answers, also redisplay available helpers .... By Muhammad Essam
function getQuestion()
{
    hideVid();
    showElementWithClassName(".answer");
    showHelpers();
    for(i in score)
    {
        score[i].style="";
    }
    score[scoreIndex].style.cssText = "box-shadow: inset 0 0 20px orange, 0 0 20px rgba(199, 100, 8, 0.2);outline-color: rgba(255, 255, 255, 0);outline-offset: 15px;text-shadow: 1px 1px 2px #427388";
    if(answersDeleted)
    {
        answers[fIndex].style.visibility = "visible";
        answers[sIndex].style.visibility = "visible";
    }
    currentQuestion = questions[q];
    question.innerHTML = currentQuestion.question;   
    for(let i = 0;i < 4; i++)
    {
        answers[i].innerHTML = currentQuestion.answers[i];
    }
}

// checks the answer ,
// if true: get the next question, else: gameOver .... By Muhammad Essam
function checkAnswer(answer)
{
    document.getElementById("clickSound").play();
    if(answer.innerHTML == currentQuestion.correct)
    {
        correctAns();
        answer.style.backgroundColor = "green";
        if(q<14) { 
            q++;
        }
        else{
            q++;
            setTimeout(() => {
                myRedirect("GameOver.html",{'currentQuestion':q,'playerName':playerName});
            }, 2000);
        }
        scoreIndex--;
        setTimeout(() => {
            answer.style.backgroundColor = "";
            getQuestion();        
        }, 2000);
    }
    else
    {
        wrongAns();
        answer.style.backgroundColor = "orange";
        for(ans in answers)
        {
            if(answers[ans].innerHTML == currentQuestion.correct)
            answers[ans].style.backgroundColor = "green";
        }
        setTimeout(() => {
            myRedirect("GameOver.html",{'currentQuestion':q,'playerName':playerName});
        }, 3000);
    }
}

function playHoverSound()
{
    var audio = document.getElementById("hoverSound");
    var isPlaying = audio.currentTime > 0 && !audio.paused && !audio.ended 
    && audio.readyState > 2;
    if (!isPlaying) 
    {
         audio.play();
    }
}

function callFriend(){
    hideElementWithClassName(".answer , .help");
    setTimeout(() => {
        showElementWithClassName(".answer");
    }, 32500);
    var audio = document.getElementById("callFriend");
    var isPlaying = audio.currentTime > 0 && !audio.paused && !audio.ended 
    && audio.readyState > 2;
    if (!isPlaying) 
    {
         audio.play();
    }
    callMade = true;

}

function deleteAnswerSound(){

    var audio = document.getElementById("delete2answer");
    var isPlaying = audio.currentTime > 0 && !audio.paused && !audio.ended 
    && audio.readyState > 2;
    if (!isPlaying) 
    {
         audio.play();
    }

}
//////people  opinion .... By Ahmed Korany
function peopleOpinion()
{
   var show = document.getElementById("videoPeo");
    show.style.display="none";
    var autoplay = document.getElementById("VPeople");
    document.getElementById("peoplebtn").style = "visibility:hidden";
    if (show.style.display = "none" && autoplay.pause )
    {
        autoplay.play();
        show.style.display="block"
    }
    else
    {
        autoplay.pause();
        show.style.display="none"
    }
    opinionTook = true;
}
/////hide video people opinion after finished .... By Ahmed Korany
    function hideVid()
    {
    var show = document.getElementById("videoPeo");
     show.style.display="none";
    if (show.style.display="block")
    {
        show.style.display="none"

    }
}
////////////audio of intro .... By Ahmed Korany
function introQ()
{
    var audio =document.getElementById("introSound");
    var isPlaying = audio.currentTime > 0 && !audio.paused && !audio.ended 
                        && audio.readyState > 2;
    if (!isPlaying)
    {
        audio.play();
    }
}
///////////audio of wrong answer .... By Ahmed korany
    function wrongAns()
    {
        var audio =document.getElementById("wrongSound");
        var isPlaying = audio.currentTime > 0 && !audio.paused && !audio.ended 
                        && audio.readyState > 2;
        if (!isPlaying)
        {
            audio.play();
        }
    
    }
    ////////////audio of correct answer .... By Ahmed Korany
    function correctAns()
    {
        var audio =document.getElementById("correctSound");
        var isPlaying = audio.currentTime > 0 && !audio.paused && !audio.ended 
                        && audio.readyState > 2;
        if (!isPlaying)
        {
            audio.play();
        }
        else
        {
            
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        }
    
    }



// Redirect to Game Over.html
function myRedirect(path, parameters) {
    var form = $('<form></form>');

    form.attr("method", "get");
    form.attr("action", path);

    $.each(parameters, function(key, value) {
        var field = $('<input></input>');
        field.attr("type", "hidden");
        field.attr("name", key);
        field.attr("value", value);
        form.append(field);
    });
    $(document.body).append(form);
    form.submit();
}

