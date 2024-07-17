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
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const { theme, setTheme } = useContext(ThemeContext);
  console.log(theme);

  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);

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

    socket.on("chat:message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("users:online");
      socket.off("chat:message");
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
    socket.disconnect();
    navigate("/");
  }

  function handleSendMessage() {
    if (message.trim()) {
      socket.emit("chat:message", {
        username: localStorage.username,
        content: message,
      });
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

      <div className="flex space-x-4 justify-center mt-10">
        <div className="bg-slate-100 px-4 py-2 rounded-lg">
          <h3>Player online:</h3>
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

      <div className="bg-white p-4 mt-4 rounded-lg">
        <h3>Chat</h3>
        <div className="h-64 overflow-y-scroll border border-gray-300 p-2">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <strong>{msg.username}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-l-md"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-blue-400 hover:bg-blue-500 text-white rounded-r-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicTacToe;