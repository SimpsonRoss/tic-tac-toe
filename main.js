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

/*----- cached elements  -----*/
const messageEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('button');

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', boardClick);
playAgainBtn.addEventListener('click', init);

/*----- functions -----*/
init();

function init() {
  board = [
    [0, 0, 0], //col 0
    [0, 0, 0], //col 1
    [0, 0, 0], //col 2
  ];
  turn = 1;
  winner = null;
  render();
}

function boardClick(evt) {

  // Split the id string of the div to get the index
  const idOfSquare = evt.target.id.split('c')[1].split('r');
  const colIdx = parseInt(idOfSquare[0]);
  const rowIdx = parseInt(idOfSquare[1]);

  console.log(`col ${colIdx} row ${rowIdx}`);
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

  // Check the current column for a winning line
  if (
    board[0][rowIdx] === player &&
    board[1][rowIdx] === player &&
    board[2][rowIdx] === player) {
    return player;
  }

  // Check the current row for a winning line
  if (
    board[colIdx][0] === player &&
    board[colIdx][1] === player &&
    board[colIdx][2] === player) {
    return player;
  }

  // Check the diagonals SW & NE
  if (colIdx === rowIdx &&
    board[0][0] === player &&
    board[1][1] === player &&
    board[2][2] === player) {
    return player;
  }

  // Check the diagonals SE & NW
  if (colIdx + rowIdx === 2 &&
    board[0][2] === player &&
    board[1][1] === player &&
    board[2][0] === player) {
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
    messageEl.innerHTML = `${PLAYERS[winner]} Wins!`;
  } else {
    // Game is in play
    messageEl.innerHTML = `${PLAYERS[turn]}'s Turn`;
  }
};

function renderControls() {
  playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
};
