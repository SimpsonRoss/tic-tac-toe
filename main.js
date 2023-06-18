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
let winLine;
let player1 = 'Player 1';
let player2 = 'Player 2';


/*----- cached elements  -----*/
const messageEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('#playAgain');
const enterNamesBtn = document.querySelector('#enterNames');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const submitNamesBtn = document.getElementById('submitNames');
const playerNamesDialog = document.getElementById('playerNames');
const boardEl = document.getElementById('board');

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', boardClick);
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
  render();
}

function resetGame() {
  board = [
    [0, 0, 0], //col 0
    [0, 0, 0], //col 1
    [0, 0, 0], //col 2
  ];
  winLine = [];
  turn = 1;
  winner = null;
  render();
}

function setPlayerNames() {
  player1 = player1Input.value || 'Player 1';
  player2 = player2Input.value || 'Player 2';

  //reset the input values
  player1Input.value = '';
  player2Input.value = '';

  //restart the game, since name's have changed
  init()
  // Hide the input dialog
  playerNamesDialog.close();
  render()
}

function boardClick(evt) {
  // Guards...
  // Returns without procesing, if someone has won already or it's a tie
  if (winner !== null) {
    return;
  }
  // Returns if the user clicks on something that isn't one of our 9 divs (i.e. the playableboard)
  if (!evt.target.id.startsWith('c')) {
    return;
  }

  // Split the id string of the div to get the index
  const idOfSquare = evt.target.id.split('c')[1].split('r');
  const colIdx = parseInt(idOfSquare[0]);
  const rowIdx = parseInt(idOfSquare[1]);

  //console.log(`col ${colIdx} row ${rowIdx}`);
  //assigning the turn value to that square
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
  console.log(player);

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
  if (playerNamesDialog.open === false) {
    renderBoard();
    renderMessage();
    renderControls();
    renderWinningLine()
  }
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
  if (winner === 'T') {
    messageEl.innerText = "It's a Tie!";
  } else if (winner) {
    messageEl.innerHTML = `${PLAYERS[winner] === 'X' ? player1 : player2} Wins!`;
  } else {
    // Game is in play
    messageEl.innerHTML = `${turn === 1 ? player1 : player2}'s Turn`;
  }
};

function renderControls() {
  const boardEl = document.getElementById('board');

  if (board.flat().every(cell => cell === 0)) {
    playAgainBtn.style.visibility = 'hidden';
    enterNamesBtn.style.visibility = 'hidden';
    boardEl.classList.remove('noHover');
  } else {
    playAgainBtn.style.visibility = 'visible';
    enterNamesBtn.style.visibility = 'visible';
    if (winner) boardEl.classList.add('noHover');
  }

  playAgainBtn.innerText = winner ? 'PLAY AGAIN' : 'RESET GAME';
};

function renderWinningLine() {
  const wholeBoard = ["c0r2", "c1r2", "c2r2", "c0r1", "c1r1", "c2r1", "c0r0", "c1r0", "c2r0"];
  wholeBoard.forEach((cell) => {
    document.querySelector(`#${cell} > p`).classList.remove('winningLine');
  })

  if (winner) {
    winLine.forEach((winningCell) => {
      document.querySelector(`#${winningCell} > p`).classList.add('winningLine');
    })
  }
}
