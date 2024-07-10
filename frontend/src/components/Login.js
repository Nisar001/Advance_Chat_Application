import React, { useState } from 'react';
import axios from 'axios';

const Signin = ({ setToken }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/login', { userEmail, userPassword });
      setToken(response.data.token);
    } catch (err) {
      setMessage('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Signin</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="UserEmail"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          required
        />
        <button type="submit">Signin</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Signin;
