/*---------------------*/
/*----- CONSTANTS -----*/
/*---------------------*/
const POCKETS = []

const PLAYERS = [
    "A",
    "B"
]

/*---------------------*/
/*----- VARIABLES -----*/
/*---------------------*/
let playersTurn;
let scores;
let pocketTotals;
let marbles;
let replay;
let getWinner;

/*----------------------------*/                    
/*----- CACHED ELEMENTS  -----*/
/*----------------------------*/
const instructionsEl = document.querySelector('#instructions') // cache how to play button
const popUpEl = document.querySelector(".inst") // cache instructions pop up box
const pocketsBtn = document.querySelector('.container'); // cache player's selection
const playersEl = document.querySelector('#player-turn'); // cache player's turn
const scoreAEl = document.querySelector('#scoreA'); // cache player A's score
const scoreBEl = document.querySelector('#scoreB'); // cache player B's score
const totalsA = document.querySelectorAll('.totalsA'); // cache total marbles per pocket for side A
const totalsB = document.querySelectorAll('.totalsB'); // cache total marbles per pocket for side B
const winnerEl = document.querySelector('#winner'); // cache winner
const replayEl = document.querySelector('footer');  // cache the replay element

/*---------------------------*/
/*----- EVENT LISTENERS -----*/
/*---------------------------*/
instructionsEl.addEventListener('click', renderInstructions); // listens for a click within the instructions button
popUpEl.addEventListener('click', renderCloseWindow); // listens for a click inside of the instructions popup to close the popup
pocketsBtn.addEventListener('click', moveMarbles); // logs which button is clicked
replayEl.addEventListener('click', replayGame); // listens for player to click the Play Again button

/*---------------------*/
/*----- FUNCTIONS -----*/
/*---------------------*/
init ();

//************************************* INIT *************************************//
function init() {
    //==== function init - set the start status of the game and reset it once the replay button is hit
    playersTurn = PLAYERS[Math.floor(Math.random() * PLAYERS.length)]; //=== select random player to go first:

    scores = { //=== scores object has 1 property for each player holding score of zero
        playerA: 0,
        playerB: 0
    }
    
    for (i=0; i < 14; i++) { // builds the POCKETS array adding 4 marbles each 
        POCKETS[i] = 4;
    }
    POCKETS[6]= 0; // updating the mancala pockets #6 and #13 to a starting number of 0
    POCKETS[13] = 0;
    
    updatePocketTotal(); //=== pocketTotal initializes to 24 each:

    getWinner = 'A'; //=== starts winner as player A
    
    render();
}

//************************************* RENDER *************************************//
function render() {
    //=== update the screen to show who's turn it is
    renderScores(); //=== update the player's scores on screen
    renderPlayers(); //=== updates current player on screen
    renderSideA(); //=== keeps side A pockets updated with the correct number of marbles
    renderSideB(); //=== keeps side B pockets updated with the correct number of marbles
    renderWinner(); //=== checks for winner and shows winner on screen removing player's turn 
}

function renderInstructions() {
    //=== makes instructions visible and brings them to the front of the screen
    popUpEl.style.opacity = "1";
    popUpEl.style.zIndex="10";
}

function renderCloseWindow() {
    //=== makes instructions invisible and sends them to the back to avoid interferance with game play
    popUpEl.style.opacity = "0";
    popUpEl.style.zIndex = "-10";
}

function renderScores() {
    //=== update the player's scores on screen
    scoreAEl.innerText = scores.playerA; 
    scoreBEl.innerText = scores.playerB;
}

function renderPlayers() {
    //=== updates current player on screen
    playersEl.innerText = `It's Player ${playersTurn}'s Turn!`;
}

function renderSideA() {
    //=== updates all pockets on side A on screen to show the total number of marbles per pocket
    //=== due to the game play of mancala being counter-clockwise, side A needs to be a 
    //    separate function from side B so that it loops over the array in reverse order
    let j = 6; 
    for (let i=0; i<=totalsA.length; i++) {
        totalsA[i].style.backgroundImage = `url(imgs/marbles${POCKETS[j]}.png)`; 
        if (j>0) {
            j--;
        } else {
            return;
        }
    }
}

function renderSideB() {
    //=== updates all pockets on side B on screen to show the total number of marbles per pocket
    totalsB.forEach(function(pocketElB, idx) {
        pocketElB.style.backgroundImage = `url(imgs/marbles${POCKETS[idx+7]}.png)`;   
    })
}

function renderWinner() {
    //=== checks if there is a winner and updates the DOM with the winner's letter and hides player's
    //    turn language
    if (checkEndGame()) {
        if (getWinner != 'TIE') {
            winnerEl.innerText = `Congratulations player ${getWinner}!!  YOU WIN!!`;
            playersEl.innerText = ``
            replayEl.innerText = 'PLAY AGAIN?'
            for (i=0; i < POCKETS.length; i++){  //=== empties each pocket if there is a winner
                POCKETS[i] = 0; 
            }
        } else {
            winnerEl.innerText = "IT'S A TIE!!!"
            playersEl.innerText = ``
            replayEl.innerText = 'PLAY AGAIN?'
        }
    } else {
        winnerEl.innerText = ''; //keeps text hidden if there is no winner
        replayEl.innerText = '';
    }
}

//************************************* HANDLE MOVE *************************************//
function moveMarbles(e) {
    if (e.target.tagName !== 'BUTTON') { //=== ensure nothing happens unless a button is selected
        return;
    }
    i = e.target.id;        //=== assigns the id of the event target which will be used as the index in the array
    marbles = POCKETS[i];   //=== assigns marbles to the number of marbles in the pocket selected
    POCKETS[i] = 0;         //=== updates the current pocket to zero
    i++;                    //=== updates the index so that we can move to the next pocket 
    for (marbles; marbles > 0; marbles--) {   
        if (i < POCKETS.length) {         
            if (playersTurn === 'A' && i === 13) {  //=== skips opponents mancala
                i++;        // moves to the next pocket
                marbles++;   // resets marbles
            } else if (playersTurn === 'B' && i === 6) {
                i++;        // moves to the next pocket
                marbles++;   // resets marbles
            } else {
            POCKETS[i]++;
            i++;
            }
        } else {
            i = 0; // resets index to 0 once we get to the end of the array
            marbles++; // adds back in missing marble
        }
    }
    gamePlay(i);
    render(); //=== calls render to update the screen prior to the next move/click
}

function gamePlay(idx) {
    updatePlayerScores(POCKETS[6], POCKETS[13]); //=== assigns playerScores to the mancala pockets
    updatePocketTotal(); //=== determines total marbles in each sides pockets
    if (checkEndGame()) {  //=== proceeds with tallyFinalScores and getWinner if game over
        tallyFinalScores();
        getWinner = checkWinner();
    } else {
        let finalPocket = idx-1; //=== continues game play
        if (playersTurn === 'A'  && finalPocket === 6) { //=== checks if player A lands in home pocket
            return; //=== if true, keeps player A's turn
        } else if (playersTurn === 'B' && finalPocket === 13) { //=== checks if player B lands in home pocket
            return; //=== if true, keeps player B's turn
        } else {
            changePlayer(); //=== otherwise changes the player
        }
    }
    render();
}

function updatePlayerScores(scoreA, scoreB) {
    //==== function playerScores - this will count the number of marbles in each mancala and update the scores
     scores.playerA = scoreA;
     scores.playerB = scoreB ;
}

function changePlayer () {
    // after each turn - this function changes the player
    if (playersTurn === 'A'){
        playersTurn = 'B'
    } else {
        playersTurn = 'A'
    }
    render();
}

function updatePocketTotal() {
    //=== totals side A and side B pockets and assigns pocketTotals the values
    let playerAPocketTotal = 0;
    let playerBPocketTotal = 0;
    for (x=0; x < POCKETS.length; x++) {
        if (x < 6) {
            playerAPocketTotal += POCKETS[x];
        } else if (x > 6 && x < 13) {
            playerBPocketTotal += POCKETS[x];
        } else {
        }
    }
    pocketTotals = {
        playerA: playerAPocketTotal,
        playerB: playerBPocketTotal
    }
}

function checkEndGame() {
    //=== checks if either of the objects within pocketTotals is equal to
    // zero - this ends the game because one players side is empty
    if (pocketTotals.playerA === 0 || pocketTotals.playerB === 0) {
        return true;
    } else {
        return false;
    }
    render();
}

function tallyFinalScores() {
    //adds remaining marbles to the player who still has marbles in their pockets
    scores.playerA = scores.playerA + pocketTotals.playerA;
    scores.playerB = scores.playerB + pocketTotals.playerB;
    render();
}

function checkWinner() {
    // checks who's score is highest and returns 'A' 'B' or 'IT'S A TIE'
    if (scores.playerA > scores.playerB) {
        return 'A'
    } else if (scores.playerB > scores.playerA) {
        return 'B'
    } else {
        return 'TIE'
    }
    render()
}

function replayGame(e) {
    // runs the init function if the replay section is clicked
    init();
}

