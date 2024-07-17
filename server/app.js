const { Server } = require("socket.io");

const io = new Server({

});

// let rooms = {};

function checkWinner(board) {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertikal
    [0, 4, 8], [2, 4, 6]             // diagonal
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
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on('joinRoom', (roomId) => {
    console.log("Joined room:", roomId);
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [socket.id],
        board: [null,null,null,null,null,null,null,null,null],
        currentPlayer: 0,
        gameOver: false,
        winner: null
      };
    } else if (rooms[roomId].players.length < 2) {
      rooms[roomId].players.push(socket.id);
    }
    io.to(roomId).emit('gameState', rooms[roomId]);
  });

  socket.on('makeMove', ({ roomId, index }) => {
    const room = rooms[roomId];
    if (room && !room.gameOver && room.board[index] === null) {
      room.board[index] = room.currentPlayer === 0 ? 'X' : 'O';
      
      const winner = checkWinner(room.board);
      if (winner) {
        room.gameOver = true;
        room.winner = winner;
      } else {
        room.currentPlayer = 1 - room.currentPlayer;
      }
      
      io.to(roomId).emit('gameState', room);
    }
  });

  socket.on('resetGame', (roomId) => {
    if (rooms[roomId]) {
      rooms[roomId].board = Array(9).fill(null);
      rooms[roomId].currentPlayer = 0;
      rooms[roomId].gameOver = false;
      rooms[roomId].winner = null;
      io.to(roomId).emit('gameState', rooms[roomId]);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Here you might want to handle player disconnection,
    // such as ending the game or removing the player from the room
  });
});

io.listen(3000);

