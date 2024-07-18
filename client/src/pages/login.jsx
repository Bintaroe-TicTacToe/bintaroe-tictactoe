import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username) {
      localStorage.setItem("username", username);
      navigate("/tictactoe");
    } else {
      alert("Please enter a username.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <label htmlFor="username">Enter your username: </label>
          <input
            className="border rounded px-2 py-1 border-gray-500"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button
          className="rounded px-2 py-1 bg-blue-500 hover:bg-blue-600 mt-2 font-semibold"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
