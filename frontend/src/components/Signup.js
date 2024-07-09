import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:8080/auth/v1/register', { userName, userEmail, userPhone, userPassword });
      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="login-signup-header">Signup</h2>
      {/* <form method="POST"> */}
      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Username" />
      <input type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="UserEmail" />
      <input type="text" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} placeholder="UserPhone" />
      <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Password" autoComplete='on'/>
      <button onClick={handleSignup}>Signup</button>
      {/* </form> */}
    </div>
  );
}

export default Signup;