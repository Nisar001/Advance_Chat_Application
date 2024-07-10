import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const Chat = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:8080/auth/users', {
        headers: { Authorization: token }
      });
      setUsers(response.data);
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    const newSocket = io('http://localhost:8080', {
      auth: { token }
    });

    newSocket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [token]);

  const handleSelectUser = async (user) => {
    setSelectedUser(user.userName);
    const room = [user.userName, 'you'].sort().join('-');
    socket.emit('joinRoom', room);
    const response = await axios.get(`http://localhost:8080/messages/${room}`, {
      headers: { Authorization: token }
    });
    setMessages(response.data);
  };

  const handleMessageSend = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    const room = [selectedUser, 'you'].sort().join('-');
    socket.emit('message', { room, content: message });
    setMessages((prev) => [...prev, { sender: 'You', room, content: message, timestamp: new Date() }]);
    setMessage('');
  };

  return (
    <div>
      <div>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.userName} onClick={() => handleSelectUser(user)}>
              {user.userName}
            </li>
          ))}
        </ul>
      </div>
      <div>
        {selectedUser && (
          <>
            <h2>Chat with {selectedUser}</h2>
            <div>
              {messages.map((msg, index) => (
                <div key={index}>
                  <strong>{msg.sender}: </strong>
                  <span>{msg.content}</span><br/>
                  <small>{new Date(msg.timestamp).toLocaleString()}</small>
                </div>
              ))}
            </div>
            <form onSubmit={handleMessageSend}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                required
              />
              <button type="submit">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
