import React, { useState } from 'react';
import Signup from './components/Signup.js';
import Signin from './components/Login.js';
import Chat from './components/Chat.js';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const handleSetToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <BrowserRouter>
    <div>
      {!token ? (
        <>
          <Signup />
          <Signin setToken={handleSetToken} />
        </>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <Chat token={token} />
        </>
      )}
    </div>
    </BrowserRouter>
  );
};

export default App;
