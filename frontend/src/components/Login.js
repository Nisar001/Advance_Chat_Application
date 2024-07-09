import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/v1/login', { userEmail, userPassword });
      localStorage.setItem('token', response.data.token);
      navigate('/chat');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="login-signup-header">Login</h2>
      <input type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="UserEmail" />
      <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
