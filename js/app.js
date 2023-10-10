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
let getWinner;

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
const winnerEl = document.querySelector('#winner'); // cache winner
const replayEl = document.querySelector('footer');  // cache the replay element


//=== cached pockets
const pocketA1El = document.querySelector('#a-one');
const pocketA2El = document.querySelector('#a-two');
const pocketA3El = document.querySelector('#a-three');
const pocketA4El = document.querySelector('#a-four');
const pocketA5El = document.querySelector('#a-five');
const pocketA6El = document.querySelector('#a-six');
const pocketB1El = document.querySelector('#b-one');
const pocketB2El = document.querySelector('#b-two');
const pocketB3El = document.querySelector('#b-three');
const pocketB4El = document.querySelector('#b-four');
const pocketB5El = document.querySelector('#b-five');
const pocketB6El = document.querySelector('#b-six');

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
    playersTurn = PLAYERS[Math.floor(Math.random() * PLAYERS.length)]; //=== select random player to go first:

    scores = { //=== scores object has 1 property for each player holding score of zero
        playerA: 0,
        playerB: 0
    }
    
    for (i=0; i < POCKETS.length; i++){  //=== each pocket will hold 4 stones
        POCKETS[i] = 4; 
    }
    
    POCKETS[6]= 0;  //=== updating the mancalas from 4 to 0
    POCKETS[13] = 0;
    
    pocketTotal();  //=== pocketTotal initializes to 24 each:

    getWinner = 'A';//=== starts winner as player A
    
    console.log(pocketTotals) //=== checks if working
    render();
}

//************************************* RENDER ************************************* //
function render() {
    playersEl.innerText = `It's Player ${playersTurn}'s Turn!`; //==== update the screen to show who's turn it is
    scoreAEl.innerText = scores.playerA; //=== update the player's scores
    scoreBEl.innerText = scores.playerB;
    renderButtons(); //=== keeps each pocket updated with the number of stones
    renderWinner();  //=== checks for winner and shows winner on screen removing player's turn 
}

function renderButtons() {
    //=== updates all pockets on screen to show their current number of stones
    pocketA1El.innerText = POCKETS[0];
    pocketA2El.innerText = POCKETS[1];
    pocketA3El.innerText = POCKETS[2];
    pocketA4El.innerText = POCKETS[3];
    pocketA5El.innerText = POCKETS[4];
    pocketA6El.innerText = POCKETS[5];
    pocketB1El.innerText = POCKETS[7];
    pocketB2El.innerText = POCKETS[8];
    pocketB3El.innerText = POCKETS[9];
    pocketB4El.innerText = POCKETS[10];
    pocketB5El.innerText = POCKETS[11];
    pocketB6El.innerText = POCKETS[12]; 
}

function renderWinner() {
    if (checkEndGame()) {
        winnerEl.innerText = `The winner is player ${getWinner}`;
        playersEl.innerText = ``
        
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
            console.log(POCKETS[i]);
            i++;
            console.log(i)
            }
        } else {
            i = 0; // resets index to 0 once we get to the end of the array
        }
    }
    console.log(POCKETS); //=== checks to see if all is working
    playerScores(POCKETS[6], POCKETS[13]); //=== assigns playerScores to the mancala pockets
    pocketTotal(); //=== runs function to determine total stones in each sides pockets
    console.log(pocketTotals)  //=== checks to see if all is working
    console.log(checkEndGame()); //=== checks to see if endgame is returning true/false accurately
    if (checkEndGame()) {  //=== proceeds with tallyFinalScores and getWinner if game over
        console.log('GAME OVER!!!')
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
    scores.playerA = scores.playerA + pocketTotals.playerA;
    scores.playerB = scores.playerB + pocketTotals.playerB;
    
    /// *********** TOMORROW!!!  Need to remove all stones from remaining pockets once scores are tallied **********
    render();
}

function checkWinner() {
    if (scores.playerA > scores.playerB) {
        console.log(`Player A WINS!!!`)
        return "A"
    } else if (scores.playerB > scores.playerA) {
        console.log(`Player B WINS!!!`)
        return "B"
    } else {
        return "IT'S A TIE"
    }
    render()
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
