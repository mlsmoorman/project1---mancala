## Welcome to the world of...
![alt text](https://i.imgur.com/P9zSVLQl.png)

#### The word Mancala is derived from an Arabic root meaning "to move".

### History  
One of the oldest known games to be played today, Mancala has been found in archeological evidence dating back as early as 700AD in East Africa, however, some of the oldest boards date back to approximately 5,780BC in Jordan.

### Screenshots

Initial game board:

![alt text](https://i.imgur.com/u7vx9mxl.png)

In game instructions:

![alt text](https://i.imgur.com/LHr0fA8l.png)

During game play:

![alt text](https://i.imgur.com/F2ejkBtl.png)
![alt text](https://i.imgur.com/IDMHXDVl.png)

Winner boards:

![alt text](https://i.imgur.com/ohxt9VMl.png)
![alt text](https://i.imgur.com/Z1lQWIOl.png)


### Technologies Used
  MVC Method using:
  1. HTML - set up the static/unchanging information that is located on the DOM includes:
      - the Header "Mancala"
      - game instructions
      - Mancala for each player
      - Replay box

  2. CSS - set up the appearance of the DOM includes:
      - use of a flex and grid layouts for the overall screen and game board
      - incorporates:
          - vmin so that all aspects of the game are interactive and change with the screen size
          - hover to hightlight which button the user has the mouse over
          - z-axis to help move the instructions box out of the way of other buttons when not in use
          - box-shadow to create a glow behind the header and game board for ancient appearance

  3. JavaScript - game play includes:
      - init function to set the initial values of the game/resets them once replay is hit
      - render function to set the look of the game and change it as game play continues
      - calls 5 sub-functions to update the DOM:
          - renderScores - update player scores
          - renderPlayers - update player turn
          - renderSideA - update side A marbles
          - renderSideB - update side B marbles
          - renderWinner - update winner
      - gameplay begins with a random player selection and the click of a button which calls the moveMarbles function
          - moves marbles across the gameboard according to game rules
          - calls the gamePlay function
              - calls the updatePlayersScores function
              - calls the updatePocketTotals function
              - calls the checkEndGame function
                - if true calls the tallyFinalScores and checkWinner functions
                - else game play continues by checking if the player landed in their own Mancala to keep the player the same or move on to the next player by calling the changePlayer function

[PLAY NOW!](https://mlsmoorman.github.io/project1---mancala/)

### The Game

SetUp:  To start the game board shows an empty Mancala and score of zero assigned to each player along with 6 pockets on each side of the board containing 4 stones -- side A and side B.

Object:  The object of the game is to capture the most marbles by the end of the game.

Game Play:  
  1. The game begins with one player (selected by random draw) picking a pocket from their side of the game board.
  2. The chosen pocket will then disburse around the board dropping one stone in each pocket, including the player's Mancala but skipping the opponents Mancala
  3. If the count ends in the player's Mancala, that player gets to take another turn.
  4. All captured pieces go to the player's Mancala

Winning the Game:
  1. The game ends when all 6 pockets on one side of the Mancala board are empty.
  2. The player that still has pieces on their side of the board captures those pieces and they are deposited to that player's Mancala
  3. The player with the most pieces in their Mancala at the end of the game WINS!!!

### Future Updates

  1. Create the option for a computer opponent
  
  2. Capture Function - If the last piece dropped is in an empty pocket on the player's side of the board, that piece along with any pieces in the pocket directly opposite are moved to the player's Mancala

  3. Hover pocket CSS - hovering over a pocket will reveal the count of the stones within that pocket

  4. Removal of the buttons themselves and allow players to click within the actual pockets

  5. Removal of images for marbles and tie in actual marble pieces that can be moved by the players from one pocket to the next
