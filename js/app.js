/*---------------------*/
/*----- CONSTANTS -----*/
/*---------------------*/
const POCKETS = []

const PLAYERS = [
    "A",
    "B"
]

/*---------------------------*/
/*----- STATE VARIABLES -----*/
/*---------------------------*/
let playersTurn;
let scores;
let pocketTotals;
let stones;
let replay;
let getWinner;

/*----------------------------*/                    
/*----- CACHED ELEMENTS  -----*/
/*----------------------------*/
//=====  Stones - cache the stones so that they can move from pocket to pocket on the screen
//=====  Score - cach the player score to update each time a stone lands in a player's Mancala
//=====  Winner - cache the winner to change the display of who the winner is once game is over
const pocketsBtn = document.querySelector('.container'); // cache player's selection
const playersEl = document.querySelector('#player-turn'); // cache player's turn
const scoreAEl = document.querySelector('#scoreA'); // cache player A's score
const scoreMrbEl = document.querySelector('#scoreA')
const scoreBEl = document.querySelector('#scoreB'); // cache player B's score
const winnerEl = document.querySelector('#winner'); // cache winner
const replayEl = document.querySelector('footer');  // cache the replay element

//=== cached pockets
const pocketA1El = document.querySelector('#A1');
const pocketA2El = document.querySelector('#A2');
const pocketA3El = document.querySelector('#A3');
const pocketA4El = document.querySelector('#A4');
const pocketA5El = document.querySelector('#A5');
const pocketA6El = document.querySelector('#A6');

const totalsA = document.querySelectorAll('.totalsA');
const totalsB = document.querySelectorAll('.totalsB');

/*---------------------------*/
/*----- EVENT LISTENERS -----*/
/*---------------------------*/
//==== This section will need an event listener for the click that is within each of the pockets which
//==== will tell the stones to move from the current pocket to the next pockets
pocketsBtn.addEventListener('click', handleMove); // logs which button is clicked
replayEl.addEventListener('click', replayGame);

/*--------------------------------------------*/
/*----- CONTROLLER FUNCTIONS DEFINITIONS -----*/
/*--------------------------------------------*/
init ();

//************************************* INIT ************************************* //
function init() {
    //==== function init - set the start status of the game and reset it once the replay button is hit
    playersTurn = PLAYERS[Math.floor(Math.random() * PLAYERS.length)]; //=== select random player to go first:

    scores = { //=== scores object has 1 property for each player holding score of zero
        playerA: 0,
        playerB: 0
    }
    
    // builds the POCKETS array adding 4 stones each
    for (i=0; i < 14; i++) {
        POCKETS[i] = 4;
    }

    // updating the mancala pockets #6 and #13 to a starting number of 0
    POCKETS[6]= 0;  
    POCKETS[13] = 0;
    
    pocketTotal();  //=== pocketTotal initializes to 24 each:

    getWinner = 'A';//=== starts winner as player A
    
    render();
}

//************************************* RENDER ************************************* //
function render() {
    //=== update the screen to show who's turn it is
    playersEl.innerText = `It's Player ${playersTurn}'s Turn!`;
    //=== update the player's scores
    scoreAEl.innerText = scores.playerA; 
    scoreBEl.innerText = scores.playerB;
    renderStones(); //=== keeps each pocket updated with the number of stones
    renderWinner();  //=== checks for winner and shows winner on screen removing player's turn 
}

function renderStones() {
    //=== updates all pockets on screen to show their current number of stones
    pocketA1El.style.backgroundImage = `url(imgs/marbles${POCKETS[0]}.png)`;
    pocketA2El.style.backgroundImage = `url(imgs/marbles${POCKETS[1]}.png)`;
    pocketA3El.style.backgroundImage = `url(imgs/marbles${POCKETS[2]}.png)`;
    pocketA4El.style.backgroundImage = `url(imgs/marbles${POCKETS[3]}.png)`;
    pocketA5El.style.backgroundImage = `url(imgs/marbles${POCKETS[4]}.png)`;
    pocketA6El.style.backgroundImage = `url(imgs/marbles${POCKETS[5]}.png)`;
    scoreMrbEl.style.backgroundImage = `url(imgs/marbles${POCKETS[6]}.png)`;

    totalsB.forEach(function(pocketElB, idx) {
        pocketElB.style.backgroundImage = `url(imgs/marbles${POCKETS[idx+7]}.png)`;        
    })
}

function renderWinner() {
    if (checkEndGame()) {
        winnerEl.innerText = `Congratulations player ${getWinner}!!  YOU WIN!!`;
        playersEl.innerText = ``
        for (i=0; i < POCKETS.length; i++){  //=== empties each pocket
            POCKETS[i] = 0; 
        }
    } else {
        winnerEl.innerText = ``;
    }
}

//************************************* HANDLE MOVE *************************************//
function handleMove(e) {
    if (e.target.tagName !== 'BUTTON') { //=== ensure nothing happens unless a pocket is selected
        return;
    }
    i = e.target.id;        //=== assigns the id of the event target which will be used as the index in the array
    stones = POCKETS[i];    //=== assigns stones to the number of stones in the pocket selected
    POCKETS[i] = 0;         //=== updates the current pocket to zero
    i++;                    //=== updates the index so that we can move to the next pocket 
    for (stones; stones > 0; stones--) {    //=== loops through the POCKETS array adding stones to each pocket until there are
        if (i < POCKETS.length) {           // no stones left
            if (playersTurn === 'A' && i === 13) {  //=== check which player's turn it is and check if we're in the opponent's mancala so it
                                                    // can be skipped otherwise keep disbursing stones
                i++;        // moves to the next pocket
                stones++;   // resets stones
            } else if (playersTurn === 'B' && i === 6) {
                i++;        // moves to the next pocket
                stones++;   // resets stones
            } else {
            POCKETS[i]++;
            // render();
            i++;
            }
        } else {
            i = 0; // resets index to 0 once we get to the end of the array
        }
    }
    playerScores(POCKETS[6], POCKETS[13]); //=== assigns playerScores to the mancala pockets
    pocketTotal(); //=== runs function to determine total stones in each sides pockets
    if (checkEndGame()) {  //=== proceeds with tallyFinalScores and getWinner if game over
        tallyFinalScores();
        getWinner = checkWinner();
    } else {
        let finalPocket = i-1; //=== continues game play
        if (playersTurn === 'A'  && finalPocket === 6) { //=== checks if player A lands in home pocket
            return; //=== if true, keeps player A's turn
        } else if (playersTurn === 'B' && finalPocket === 13) { //=== checks if player B lands in home pocket
            return; //=== if true, keeps player B's turn
        } else {
            changePlayer(); //=== otherwise changes the player
        }
    }
    console.log(POCKETS)
    render(); //=== calls render to update the screen prior to the next move/click
}

function playerScores(scoreA, scoreB) {
    //==== function playerScores - this will count the number of stones in each mancala and update the scores
     scores.playerA = scoreA;
     scores.playerB = scoreB ;
     render();
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

// function pocketTotal - gathers all pockes for player A and player B and generates a total that
// is assigned to the pocketTotals array
function pocketTotal() {
    let playerAPocketTotal = 0;
    let playerBPocketTotal = 0;
    // Need to add playerA pockets and playerB pockets:
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

// function checkEndGame - checks to see if either of the objects within pocketTotals is equal to
// zero - this ends the game because one players side is empty
function checkEndGame() {
    if (pocketTotals.playerA === 0 || pocketTotals.playerB === 0) {
        return true;
    } else {
        return false;
    }
    render();
}

function tallyFinalScores() {
    //adds remaining stones to the player who still has stones in their pockets
    scores.playerA = scores.playerA + pocketTotals.playerA;
    scores.playerB = scores.playerB + pocketTotals.playerB;
      
    render();
}

function checkWinner() {
    // checks who's score is highest and returns 'A' 'B' or 'IT'S A TIE'
    if (scores.playerA > scores.playerB) {
        return "A"
    } else if (scores.playerB > scores.playerA) {
        return "B"
    } else {
        return "IT'S A TIE"
    }
    render()
}

function replayGame (e) {
    // runs the init function if the replay section is clicked
    init();
}

