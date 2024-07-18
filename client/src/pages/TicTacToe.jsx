import { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import ThemeContext from "../context";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3000", {
  withCredentials: true,
});

function TicTacToe() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { theme, setTheme } = useContext(ThemeContext);
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.emit("request:gamestate");
    socket.on("gameState", (game) => {
      setBoard(game.board);
      setGameOver(game.gameOver);
      setResult(game.result);
    });
    socket.auth = {
      username: localStorage.username,
    };
    socket.disconnect().connect();
    socket.on("users:online", (users) => {
      setUsers(users);
    });
    socket.on("receiveMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("users:online");
      socket.off("receiveMessage");
    };
  }, []);

  function makeMove(index) {
    if (!gameOver) {
      socket.emit("makeMove", index);
    }
  }

  function resetGame() {
    socket.emit("resetGame");
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/");
    // socket.emit("disconnect");
    socket.disconnect()
  }

  function sendMessage() {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  }

  return (
    <div className={`bg-${theme}-200 min-h-screen`}>
      <div className="flex justify-between items-center py-2.5 px-4 border-b">
        <button
          onClick={() => {
            setTheme(theme === "slate" ? "lime" : "slate");
          }}
          className="px-2 py-1 rounded-md bg-blue-400 hover:bg-blue-500"
        >
          Theme {theme === "slate" ? "green" : "slate"}
        </button>
        <button
          onClick={handleLogout}
          className="px-2 py-1 rounded-md bg-blue-400 hover:bg-blue-500"
        >
          Logout
        </button>
      </div>

      <div className="flex justify-center mt-10 space-x-4">
        <div className="bg-slate-100 px-4 py-2 rounded-lg">
          <h3>Players online:</h3>
          <ul>
            {users.map((e, index) => (
              <li key={index} className="flex space-x-2 items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-semibold">{e.username}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 bg-sky-300 w-fit rounded-lg">
          <div className="grid grid-cols-3 gap-4 max-w-72">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => makeMove(index)}
                className="w-20 h-20 text-4xl font-bold bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                {cell}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-slate-100 rounded-md w-80 px-4 py-2 flex flex-col">
          <div className="flex flex-col h-64 overflow-y-auto p-4 border rounded-md mb-4">
            {messages.map((msg, index) => (
              <div key={index} className="my-2">
                <strong>{msg.user}</strong>: {msg.text}
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 border rounded-md"
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-md"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {gameOver && (
        <div className="bg-slate-100 rounded-md w-fit px-8 py-4 mx-auto mt-4">
          <div>{result}</div>
          <button
            onClick={resetGame}
            className="mt-4 p-2 bg-blue-400 hover:bg-blue-500 text-white rounded-md"
          >
            Reset Game
          </button>
        </div>
      )}
    </div>
  );
}

export default TicTacToe;