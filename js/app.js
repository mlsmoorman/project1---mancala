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
    "B1",
    "B2",
    "B3",
    "B4",
    "B5",
    "B6",
]
const MANCALA = [
    "Mancala-A",
    "Mancala-B"
]

/*---------------------------*/
/*----- STATE VARIABLES -----*/
/*---------------------------*/
// let scores;
// let stones;

/*----------------------------*/                    
/*----- CACHED ELEMENTS  -----*/
/*----------------------------*/
//=====  Stones - cache the stones so that they can move from pocket to pocket on the screen
//=====  Score - cach the player score to update each time a stone lands in a player's Mancala
//=====  Winner - cache the winner to change the display of who the winner is once game is over
const pocketsBtn = document.querySelector('#pockets'); // cache selection
console.log(pocketsBtn)



/*---------------------------*/
/*----- EVENT LISTENERS -----*/
/*---------------------------*/
//==== This section will need an event listener for the click that is within each of the pockets which
//==== will tell the stones to move from the current pocket to the next pockets
pocketsBtn.addEventListener('click', handleMove) // logs which button is clicked

/*--------------------------------------------*/
/*----- CONTROLLER FUNCTIONS DEFINITIONS -----*/
/*--------------------------------------------*/
init ();
//==== function init - set the start page of the game and reset it once the replay button is hit
//==== --   score - initial scores will equal 0
function init() {
    scores = { // scores object has 1 property for each player
        PlayerA: 0,
        PlayerB: 0
    }
    for (i=0; i < MANCALA.length; i++){
        MANCALA[i] = 0; // sets initial # of stones per mancala to 4
        console.log(MANCALA[i]) // check working
    }
    for (i=0; i < POCKETS.length; i++){
        POCKETS[i] = 4; // sets initial # of stones per pocket to 4
        console.log(POCKETS[i]) // check working
    }
}


//==== --   each pocket A1-A6 and B1-B6 will hold 4 stones
//==== --   each mancala will start at 0 stones

//==== function render - change the look of the screen moving stones from one pocket to the next pockets 
//==== updates the player's score based on how many stones are in the player's mancala and 
//==== update the screen to show who's turn it is

function handleMove(e) {
    console.log(e.target.tagName);
    const chosenPocket = e.target.innerText;
    console.log(chosenPocket)

}
//==== function handleChoice - will change the count of stones in the subsequent pockets once choice is made
//==== will call playerSelect to tell the computer to skip over the oposing player's mancala if applicable
//==== and will call function update scores and render to update the player screen

//==== function playerSelect - this will be a function to look at what player's turn it is and ensure to skip
//==== over the oposing player's mancala when distributing the stones

//==== function checkEmpty - this will need to keep track of each side A vs. B and check for if A1-A6
//==== and B1-B6 are empty and if true, it will need to end the game, empty out the opposing side into that
//==== player's mancala and call scores

//==== function scores - this will count the number of stones in each mancala and update the scores