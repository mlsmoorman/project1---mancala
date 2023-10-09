/*---------------------*/
/*----- CONSTANTS -----*/
/*---------------------*/
const POCKETS = [
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "A6",
    "Mancala-A",
    "B1",
    "B2",
    "B3",
    "B4",
    "B5",
    "B6",
    "Mancala-B"
]

// const MANCALA = [
//     "Mancala-A",
//     "Mancala-B"
// ]

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

/*----------------------------*/                    
/*----- CACHED ELEMENTS  -----*/
/*----------------------------*/
//=====  Stones - cache the stones so that they can move from pocket to pocket on the screen
//=====  Score - cach the player score to update each time a stone lands in a player's Mancala
//=====  Winner - cache the winner to change the display of who the winner is once game is over
const pocketsBtn = document.querySelector('#pockets'); // cache player's selection
const playersEl = document.querySelector('#player-turn'); // cache player's turn
const scoreAEl = document.querySelector('#scoreA'); // cache player A's score
const scoreBEl = document.querySelector('#scoreB'); // cache player B's score
const replayEl = document.querySelector('footer');  // cache the replay element



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

//==== function init - set the start status of the game and reset it once the replay button is hit
function init() {
    //select random player to go first:

    playersTurn = PLAYERS[Math.floor(Math.random() * PLAYERS.length)];
    
    //==== core - initial scores will equal 0
    scores = { // scores object has 1 property for each player
        playerA: 0,
        playerB: 0
    }
    
    //==== each pocket will hold 4 stones
    for (i=0; i < POCKETS.length; i++){
        POCKETS[i] = 4; 
    }
    
    // updating the mancalas from 4 to 0
    POCKETS[6]= 0;
    POCKETS[13] = 0;
    
    //=== pocketTotal initializes to 24 each:
    pocketTotal();
    
    console.log(pocketTotals)
    render();
}

function render() {
    //==== function render - change the look of the screen moving stones from one pocket to the next pockets 
    //==== updates the player's score based on how many stones are in the player's mancala and 

    //==== update the screen to show who's turn it is
    playersEl.innerText = `It's Player ${playersTurn}'s Turn!`;

    //=== update the player's scores
    scoreAEl.innerText = scores.playerA;
    scoreBEl.innerText = scores.playerB;
}

function handleMove(e) {
    // ensure nothing happens unless a pocket is selected
    if (e.target.tagName !== 'BUTTON') { 
        return;
    }

    // assigns the id of the event target which will be used as the index in the array
    // assigns stones to the number of stones in the pocket selected
    // updates the current pocket to zero
    // updates the index so that we can move to the next pocket
    i = e.target.id;
    stones = POCKETS[i];
    POCKETS[i] = 0;
    i++;
    
    // loops through the POCKETS array adding stones to each pocket until there are
    // no stones left
    for (stones; stones > 0; stones--) {
        if (i < POCKETS.length) {
            // check which player's turn it is and check if we're in the opponent's mancala so it
            //can be skipped otherwise keep disbursing stones
            if (playersTurn === 'A' && i === 13) {
                i++; // moves to the next pocket
                stones++; // resets stones
            } else if (playersTurn === 'B' && i === 6) {
                i++; // moes to the next pocket
                stones++; // resets stones
            } else {
            POCKETS[i]++;
            console.log(POCKETS[i]);
            i++;
            }
        } else {
            i = 0; // resets index to 0 once we get to the end of the array
        }
    }
    console.log(POCKETS); 
    playerScores(POCKETS[6], POCKETS[13]);
    pocketTotal();
    console.log(pocketTotals)
    console.log(checkEndGame());
    if (checkEndGame()) {
        console.log('GAME OVER!!!')
        tallyFinalScores();
        checkWinner();
    } else {
        let finalPocket = i-1;
        if (playersTurn === 'A'  && finalPocket === 6){
            return;
        } else if (playersTurn === 'B' && finalPocket === 13) {
            return;
        } else {
            changePlayer();
        }
    }
    render();
}

function playerScores(scoreA, scoreB) {
    //==== function playerScores - this will count the number of stones in each mancala and update the scores
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
}

function tallyFinalScores() {
    scores.playerA = scores.playerA + pocketTotals.playerA;
    scores.playerB = scores.playerB + pocketTotals.playerB;
    render();
}

function checkWinner() {
    if (scores.playerA > scores.playerB) {
        console.log(`Player A WINS!!!`)
    } else if (scores.playerB > scores.playerA) {
        console.log(`Player B WINS!!!`)
    } else {
        console.log(`IT'S A TIE`)
    }
}

function replayGame (e) {
    init();
}


//==== function handleChoice - will change the count of stones in the subsequent pockets once choice is made
//==== will call playerSelect to tell the computer to skip over the oposing player's mancala if applicable
//==== and will call function update scores and render to update the player screen

//==== function playerSelect - this will be a function to look at what player's turn it is and ensure to skip
//==== over the oposing player's mancala when distributing the stones

//==== function checkEmpty - this will need to keep track of each side A vs. B and check for if A1-A6
//==== and B1-B6 are empty and if true, it will need to end the game, empty out the opposing side into that
//==== player's mancala and call scores
