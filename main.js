/*----- constants -----*/
const PLAYERS = {
  '0': '',
  '1': 'X',
  '-1': 'O',
};

/*----- state variables -----*/
let board; // array of 3 column arrays
let turn; // 1 or -1 
let winner; // null = no winner; 1 or -1 winner; 'T' = tie game
let winLine; // the winning line we store to highlight green
let player1 = 'Player 1'; //name variables
let player2 = 'Player 2'; //name variables
let player1Score = 0;
let player2Score = 0;
let resetCount = 0; //for counting all games, before a reset

/*----- cached elements  -----*/
const messageEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('#playAgain');
const enterNamesBtn = document.querySelector('#enterNames');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const submitNamesBtn = document.getElementById('submitNames');
const playerNamesDialog = document.getElementById('playerNames');
const boardEl = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');

/*----- event listeners -----*/
boardEl.addEventListener('click', boardClick);
playAgainBtn.addEventListener('click', resetGame);
submitNamesBtn.addEventListener('click', setPlayerNames);

/*----- functions -----*/
init();

function init() {
  board = [
    [0, 0, 0], //col 0
    [0, 0, 0], //col 1
    [0, 0, 0], //col 2
  ];
  playerNamesDialog.show();
  winLine = [];
  turn = 1;
  winner = null;
  resetCount = 0;
  player1Score = 0;
  player2Score = 0
  render();
}

function resetGame() {
  board = [
    [0, 0, 0], //col 0
    [0, 0, 0], //col 1
    [0, 0, 0], //col 2
  ];
  winLine = [];
  //Changes who's turn it is, each time the game is reset
  resetCount++;
  if (resetCount % 2 == 0) {
    turn = 1;
  } else {
    turn = -1;
  }
  winner = null;
  render();
}

function setPlayerNames() {
  //set the player variables to the inputted names OR the defaults if needed
  player1 = player1Input.value || 'Player 1';
  player2 = player2Input.value || 'Player 2';

  //reset the input values
  player1Input.value = '';
  player2Input.value = '';

  //re-initialise the game, since the name's have changed and players are updated
  init()

  // Hide the input dialog
  playerNamesDialog.close();

  render()
}

function boardClick(evt) {
  // Guards:
  // returns without procesing, if someone has won already or it's a tie
  if (winner !== null) {
    return;
  }
  // returns if the user clicks on something that isn't one of our 9 divs (a.k.a. the playable board)
  if (!evt.target.id.startsWith('c')) {
    return;
  }

  // Split the id string of the div to get the index
  const idOfSquare = evt.target.id.split('c')[1].split('r');
  const colIdx = parseInt(idOfSquare[0]);
  const rowIdx = parseInt(idOfSquare[1]);

  //assigning the turn value to that square of the board
  board[colIdx][rowIdx] = turn;

  // Switch player turn
  turn *= -1;
  // Check for winner
  winner = getWinner(colIdx, rowIdx);
  render();
}

function getWinner(colIdx, rowIdx) {
  // Get the player
  const player = board[colIdx][rowIdx];

  // Check the current row for a winning line
  if (
    board[0][rowIdx] === player &&
    board[1][rowIdx] === player &&
    board[2][rowIdx] === player) {
    winLine.push(`c${0}r${rowIdx}`, `c${1}r${rowIdx}`, `c${2}r${rowIdx}`);
    return player;
  }

  // Check the current column for a winning line
  if (
    board[colIdx][0] === player &&
    board[colIdx][1] === player &&
    board[colIdx][2] === player) {
    winLine.push(`c${colIdx}r${0}`, `c${colIdx}r${1}`, `c${colIdx}r${2}`);
    return player;
  }

  // Check the diagonals SW & NE
  if (colIdx === rowIdx &&
    board[0][0] === player &&
    board[1][1] === player &&
    board[2][2] === player) {
    winLine.push(`c${0}r${0}`, `c${1}r${1}`, `c${2}r${2}`);
    return player;
  }

  // Check the diagonals SE & NW
  if (colIdx + rowIdx === 2 &&
    board[0][2] === player &&
    board[1][1] === player &&
    board[2][0] === player) {
    winLine.push(`c${0}r${2}`, `c${1}r${1}`, `c${2}r${0}`);
    return player;
  }

  // Check for a tie: If there are no more empty cells
  if (board.flat().every(cell => cell !== 0)) {
    return 'T';
  }

  // If we haven't returned yet, there's no winner
  return null;
}

function render() {
  renderBoard();
  renderMessage();
  renderControls();
  renderWinningLine()
}

function renderBoard() {
  board.forEach(function (colArr, colIdx) {
    colArr.forEach(function (cellVal, rowIdx) {
      const cellId = `c${colIdx}r${rowIdx}`;
      const cellEl = document.querySelector(`#${cellId} > p`);
      cellEl.innerText = `${PLAYERS[cellVal]}`;
    })
  });
}

function renderMessage() {
  // if it's a draw
  if (winner === 'T') {
    messageEl.innerText = "It's a Tie!";
    // else if there's a winner
  } else if (winner) {
    messageEl.innerHTML = `${PLAYERS[winner] === 'X' ? player1 : player2} Wins!`;
    if (PLAYERS[winner] === 'X') {
      player1Score++
    } else {
      player2Score++
    };
    scoreBoard.innerHTML = `<strong>SCORES: ${player1}: ${player1Score} | ${player2}: ${player2Score}</strong>`;
    //else, the game is in play
  } else {
    messageEl.innerHTML = `${turn === 1 ? player1 : player2}'s Turn`;
    scoreBoard.innerHTML = `<strong>SCORES: ${player1}: ${player1Score} | ${player2}: ${player2Score}</strong>`;
  }
};

function renderControls() {
  const boardEl = document.getElementById('board');

  if (board.flat().every(cell => cell === 0)) {
    playAgainBtn.style.visibility = 'hidden';
    enterNamesBtn.style.visibility = 'hidden';
    //boardEl.classList.remove('noHover');
  } else {
    playAgainBtn.style.visibility = 'visible';
    enterNamesBtn.style.visibility = 'visible';
    //if (winner) boardEl.classList.add('noHover');
  }
  //changes the message on the button so that it's relevant
  playAgainBtn.innerText = winner ? 'PLAY AGAIN' : 'RESET GAME';
};

function renderWinningLine() {
  const wholeBoard = ["c0r2", "c1r2", "c2r2", "c0r1", "c1r1", "c2r1", "c0r0", "c1r0", "c2r0"];
  // removes any winningLine class attributions from previous games
  wholeBoard.forEach((cell) => {
    document.querySelector(`#${cell} > p`).classList.remove('winningLine');
  })
  // if there's a winner, then add the winningLine class to each cell of the winning 3, to add animation and color
  if (winner) {
    winLine.forEach((winningCell) => {
      document.querySelector(`#${winningCell} > p`).classList.add('winningLine');
    })
  }
}
