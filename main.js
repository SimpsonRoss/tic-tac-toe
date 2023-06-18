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
  winLine = [];
  turn = 1;
  winner = null;
  render();
}

function boardClick(evt) {

  if (winner !== null) {
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
