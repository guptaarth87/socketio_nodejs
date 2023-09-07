import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ChatRoom = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [currentRoom, setCurrentRoom] = useState('world');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3000/'); // Replace with your server URL
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('join room', currentRoom);

      socket.on('new message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('joined', (info) => {
        setMessages((prevMessages) => [...prevMessages, info]);
      });

      socket.on('left', (info) => {
        setMessages((prevMessages) => [...prevMessages, info]);
      });
    }
  }, [socket, currentRoom]);

  const handleRoomChange = (room) => {
    socket.emit('leave room', currentRoom);
    setCurrentRoom(room);
    socket.emit('join room', room);
    setMessages([]);
  };

  const handleSendMessage = () => {
    if (message) {
      socket.emit('send message', { room: currentRoom, message });
      setMessage('');
    }
  };

  return (
    <div>
      <div className="room-selection">
        <button onClick={() => handleRoomChange('world')}>World Chat</button>
        <button onClick={() => handleRoomChange('techno')}>Techno</button>
        <button onClick={() => handleRoomChange('music')}>Music</button>
        <button onClick={() => handleRoomChange('anime')}>Anime</button>
      </div>
      <div className="chat-room">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
