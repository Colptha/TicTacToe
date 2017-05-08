
// *********************
// VARIABLES
// *********************
// just grabbing elements
var startGameButton = document.getElementById('startGameButton');
var replayButton = document.getElementById('playAgain');
var boardSquares = document.querySelectorAll('.square');
var gamePanel = document.getElementById('gamePanel');
var currentMessage = document.getElementById('currentMessage');
var playerScore = document.getElementById('playerScore');
var computerScore = document.getElementById('computerScore');
var playerName = document.getElementById('playerName');
var name;

// generally it is better to have named constants
// 'magic-numbers' are considered bad practice 
const TOP_LEFT = 0;
const TOP_MID = 1;
const TOP_RIGHT = 2;
const MID_LEFT = 3;
const MID_MID = 4;
const MID_RIGHT = 5;
const BOT_LEFT = 6;
const BOT_MID = 7;
const BOT_RIGHT = 8;
const FIRST = 0;
const SECOND = 1;
const THIRD = 2;

// player and computer pieces
var pieces = {
  player : 'X',
  computer : 'O'
};

// this serves as a model to update which can later be applied to our view in html
var gameBoard = {
                  'one' : ' ',
                  'two' : ' ',
                  'three' : ' ',
                  'four' : ' ',
                  'five' : ' ',
                  'six' : ' ',
                  'seven' : ' ',
                  'eight' : ' ',
                  'nine' : ' '
                };

// the keys array makes it possible to iterate through the board
// since you can't iterate from 'one' to 'nine' the keys array allows
// iteration from 0 to 8 returning 'one' to 'nine'
var keysArray = Object.keys(gameBoard);

// this is just an array filled with 8 arrays
// all the possible combinations of winning
// seemed the easiest way to check for a win
var winningCombos = [
  [TOP_LEFT, TOP_MID, TOP_RIGHT],
  [MID_LEFT, MID_MID, MID_RIGHT],
  [BOT_LEFT, BOT_MID, BOT_RIGHT],
  [TOP_LEFT, MID_LEFT, BOT_LEFT],
  [TOP_MID, MID_MID, BOT_MID],
  [TOP_RIGHT, MID_RIGHT, BOT_RIGHT],
  [TOP_LEFT, MID_MID, BOT_RIGHT],
  [TOP_RIGHT, MID_MID, BOT_LEFT]
];

// *********************
// HELPER FUNCTIONS
// *********************

// this function applies the 'hide' class to an element, making it dynamically disappear
function hide(element) {
  element.classList.add('hide');
}

// this function removes the 'hide' class, causing elements to appear
function show(element) {
  element.classList.remove('hide');
}

// *********************
//    INITIAL SET UP
// *********************

// this function is attached to the start game button and is
// called whenever the start button is clicked
var beginGame = function() {
  // this adds event listeners to the board squares
  makeBoardInteractive();

  // this hides the start game button
  hide(startGameButton);

  // this reveals the message and score panel
  show(gamePanel);

  // this puts a greeting in the message panel
  displayGreeting();

  // this asks the user for their name and inserts it above
  // where their score is kept
  // it also keeps the name value in a global variable for later use
  setName();
}

// adding event listeners to all board squares
function makeBoardInteractive() {
  for (var i = 0; i < boardSquares.length; i++) {
    boardSquares[i].addEventListener('click', playerTurn, false);
  }
}

// inserts greeting into the message panel
function displayGreeting() {
  currentMessage.textContent = 'Welcome to Tic-Tac-Toe!';
}

// gets name and places it above score, using "Nameless Player" as the
// default if someone just presses enter or clicks cancel
function setName() {
  // omitted the 'var' before our variable so that the value will be
  // pushed up to global scope and it can then be used in other
  // functions later
  name = prompt('What is your name?');

  // if the name is a string with at least one character it will be evaluated
  // as true, then converted to false, skipping the default name assignment
  // if it is an empty string (user pressed enter) or returns null
  // (user pressed cancel) then it will evaluate to false, then be swapped to
  // true by the ! operator, assigning a default name
  if (!name) {
    name = "Nameless Player";
  }

  // this is the h2 element above the score
  playerName.textContent = name;
}

// *********************
//     RESET GAME
// *********************

// this is used to clear the board and reassign the event listeners
// at the end of a game
var resetGame = function() {
  // assigning event listeners to all board squares
  makeBoardInteractive();

  // hide the replay button
  hide(replayButton);

  // clear the gameBoard object back to all ' ' values
  resetGameBoard();

  // use the gameBoard(js) model to update the boardSquares(html) view back
  // to all ' ' values again
  updateBoard();

  // display greeting in message panel
  displayGreeting();
}

// assigns ' ' to all values of our game board model
function resetGameBoard() {
  for (var i = 0; i < keysArray.length; i++) {
    gameBoard[keysArray[i]] = ' ';
  }
}

// *********************
//  CORE FUNCTIONALITY
// *********************

function updateBoard() {
  // loop through all of the html elements that make up our 'view'
  // update them with the information from our javascript Object
  // gameBoard, which is acting like our model
  for (var i = 0; i < boardSquares.length; i++) {
    // keysArray[i] will return each value in the keysArray
    // that value will then replace the expression with the key
    // passing in each key value to gameBoard, returning each value
    // in game board, and assigning all the values from each gameBoard
    // to the corresponding html board square
    boardSquares[i].textContent = gameBoard[keysArray[i]];
  }
}

// does the board need to be reset? is it a tie?
function isBoardFull() {
  // if any of the gameBoard keys returns ' ' then there is still
  // a space open and the game continues
  for (var i = 0; i < keysArray.length; i++) {
    if (gameBoard[keysArray[i]] === ' ') {
      return false;
    }
  }

  // if none of them returned false, then the board must be full, return true
  return true;
}

// after a win, add 1 to winners score
// parameter is either 'player' or 'computer' depending on who's turn it was
// when the win took place
function updateScore(whoever) {
  // if the player won
  if (whoever === 'player') {
    // grab their old score and turn it into an integer
    var priorScore = parseInt(playerScore.textContent, 10);

    // then add 1 to it and assign it back to the score element
    playerScore.textContent = ++priorScore;

  } else if (whoever === 'computer') {
    // same thing for the computer when they win
    var priorScore = parseInt(computerScore.textContent, 10);
    computerScore.textContent = ++priorScore;
  }
}

// used for computer generated square choice
function chooseSquare() {
  var computerChoice;
  var lookingForSquare = true;
  // try the middle square first
  var index = MID_MID;
  do {
    // the index number is passed into the keysArray
    // the keysArray returns the key ('one', 'two', etc...)
    // the key is passed into gameBoard (gameBoard['seven'] for instance)
    // the correspond value is returned (say... 'X')
    // if the value is still empty (' ') then computer chooses that spot
    if (gameBoard[keysArray[index]] === ' ') {
      // putting piece in empty spot
      gameBoard[keysArray[index]] = pieces.computer;

      // grabbing the html element that was chosen
      computerChoice = document.getElementById([keysArray[index]]);

      // removing its event listener so it can't be picked again this game
      computerChoice.removeEventListener('click', playerTurn, false);

      // make out signal value false to break the loop
      lookingForSquare = false;
    }

    // generate a random value between 0 and 8 to pass into keysArray
    // on next loop
    index = Math.floor(Math.random() * 9);

  } while (lookingForSquare); // end of loop
}

// container function for computer turn
function computerTurn() {
  // computer chooses a square
  chooseSquare();

  // use the gameBoard(js) model to update the boardSquares(html) view
  // with chosen square
  updateBoard();

  // check to see if the game is over
  if (winner('computer')) {
    // if so, let the user know by changing the message panel
    displayWinner('Your digital opponent');

    // update the score
    updateScore('computer');

    // show the replay button so they can play again
    show(replayButton);
  }
}

var playerTurn = function(e) {
  // get clicked element
  var square = e.target;

  // get id from target element that was clicked
  var squareId = square.id;

  // send the id number to the gameboard as the key setting the player marker as the value
  gameBoard[squareId] = pieces.player;

  // remove the event handler so it can't be picked twice
  makeUnclickable(square);

  // use the gameBoard(js) model to update the boardSquares(html) view
  updateBoard();

  // see if player won
  if (winner('player')) {
    // if so, post it in the message panel
    displayWinner(name);

    // update the score
    updateScore('player');

    // and show the replay button
    show(replayButton);

    // or if no one won, but the board is ful
  } else if (isBoardFull()){

    // declare a tie
    currentMessage.textContent = "It's a tie!";

    // and show the replay button
    show(replayButton);
  } else {
    // if player didn't win, and there's still spots computer takes turn
    computerTurn();
  }
}

// returns true if winner, false otherwise
function winner(whoever) {
  // iterate through 8 possible winning combos
  for (var i = 0; i < winningCombos.length; i++) {
    // if 'whoever' has a piece in the first spot of a winning row
    if (gameBoard[keysArray[winningCombos[i][FIRST]]] === pieces[whoever]) {
      // if 'whoever' also has a piece in the second spot of a winning row
      if (gameBoard[keysArray[winningCombos[i][SECOND]]] === pieces[whoever]) {
        // and in the third spot of a winning row
        if (gameBoard[keysArray[winningCombos[i][THIRD]]] === pieces[whoever]) {
          // then they won, return true
          return true;
        }
      }
    }
  }

  // if none of the winning combos are filled, no one won, return false
  return false;
}

// update message panel with winner message
function displayWinner(whoever) {
  currentMessage.textContent = whoever + " won!";
}

// removes event listener so square can't be chosen twice
function makeUnclickable(square) {
  square.removeEventListener('click', playerTurn, false);
}

// all the above functions have loaded, make our buttons live by adding
// their event listeners
startGameButton.addEventListener('click', beginGame, false);
replayButton.addEventListener('click', resetGame, false);
