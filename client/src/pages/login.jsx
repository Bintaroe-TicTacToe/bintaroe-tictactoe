import React, { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username) {
      localStorage.setItem('username', username);
      alert(`Username ${username} has been saved to localStorage.`);
    } else {
      alert('Please enter a username.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Enter your username: </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;