const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

function checkWinner(board) {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertikal
    [0, 4, 8], [2, 4, 6]             // diagonal
  ];

  for (let combo of winningCombos) {
    if (board[combo[0]] != null
      && board[combo[0]] === board[combo[1]]
      && board[combo[1]] === board[combo[2]]) {
      return `Congratulations, ${board[combo[0]]} won!`
    }
  }

  if (board.every(cell => cell !== null)) {
    return 'draw';
  }

  return null;
}

let game = null

io.on("connection", (socket) => {
  if (game !== null) {
    game.players.push(socket.id)
  }
  game = {
    players: [socket.id],
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: 0,
    gameOver: false,
    winner: null
  };
  // console.log(game.board)
  socket.emit('gameState', game)



  socket.on("makeMove", (index) => {
    game.board[index] = (game.currentPlayer === 0) ? "X" : "O"
    const winner = checkWinner(game.board)
    if (winner) {
      game.gameOver = true,
        game.winner = winner
        console.log("winner is", (game.currentPlayer === 0) ? "X" : "O")
    }
    else {
      console.log("from", game.currentPlayer)
      game.currentPlayer = (game.currentPlayer === 0) ? 1 : 0;
      console.log("to", game.currentPlayer)
    }

    socket.emit('gameState', game)
  })
});

io.listen(3000);