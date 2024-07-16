const { Server } = require("socket.io");

const io = new Server({

});

// let rooms = {};

function checkWinner(board) {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (let combo of winningCombos) {
    if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      return `Congratulations, ${board[combo[0]]} won!`
    }
  }

  if (board.every(cell => cell !== null)) {
    return 'Draw';
  }

  return null;
}

