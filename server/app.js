const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

function checkResult(board) {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // horizontal
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // vertikal
    [0, 4, 8],
    [2, 4, 6], // diagonal
  ];

  for (let combo of winningCombos) {
    if (
      board[combo[0]] != null &&
      board[combo[0]] === board[combo[1]] &&
      board[combo[1]] === board[combo[2]]
    ) {
      return `Congratulations, ${board[combo[0]]} won!`;
    }
  }

  if (board.every((cell) => cell !== null)) {
    return "draw";
  }

  return null;
}

let game = null;
let users = [];

io.on("connection", (socket) => {
  if (socket.handshake.auth.username) {
    users.push({ id: socket.id, username: socket.handshake.auth.username });
  }

  io.emit("users:online", users);

  socket.on("disconnect", () => {
    users = users.filter((e) => e.id !== socket.id);
    io.emit("users:online", users);
  });

  // socket.on("logout", () => {
  //   users = users.filter((e) => e.id !== socket.id);
  //   io.emit("users:online", users);
  // });

  // console.log(game)
  socket.on("request:gamestate", () => {
    if (game) {
      game.players.push(socket.id);
      io.emit("gameState", game);
    } else {
      game = {
        players: [socket.id],
        board: [null, null, null, null, null, null, null, null, null],
        currentPlayer: 0,
        gameOver: false,
        result: null,
      };
      // console.log(game.board)
      io.emit("gameState", game);
    }
  });

  socket.on("makeMove", (index) => {
    if (game.gameOver === false) {
      game.board[index] = game.currentPlayer === 0 ? "X" : "O";
      const result = checkResult(game.board);
      if (result) {
        (game.gameOver = true), (game.result = result);
        console.log(result);
      } else {
        game.currentPlayer = game.currentPlayer === 0 ? 1 : 0;
      }

      io.emit("gameState", game);
    }
  });

  socket.on("resetGame", () => {
    game = {
      players: [],
      board: [null, null, null, null, null, null, null, null, null],
      currentPlayer: 0,
      gameOver: false,
      result: null,
    };
    io.emit("gameState", game);
  });

  socket.on("disconnect", () => {});
});

io.listen(3000);
