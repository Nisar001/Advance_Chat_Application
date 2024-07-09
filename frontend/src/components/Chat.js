import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:8080');

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:8080/auth/v1/user-auth');
      setUsers(response.data);
    };

    fetchUsers();

    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    socket.emit('message', { message });
    setMessage('');
  };

  return (
    <div className="container chat-container">
      <h2 className="user-list">Chat</h2>
      <div>
        {users.map((user) => (
          <div key={user._id}>{user.username}</div>
        ))}
      </div>
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index}>{msg.message}</div>
        ))}
      </div>
      <div className="message-input-container">
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
      <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
