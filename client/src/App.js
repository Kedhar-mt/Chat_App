import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import JoinRoom from './components/JoinRoom';
import MessageBox from './components/MessageBox';
import MessageInput from './components/MessageInput';
import TypingIndicator from './components/TypingIndicator';
import UserList from './components/UserList';

const socket = io.connect('http://localhost:3001');

function App() {
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState('');
  const [users, setUsers] = useState([]);

  const messageEndRef = useRef(null);

  const joinRoom = () => {
    if (room !== "" && username !== "") {
      socket.emit("join_room", { room, username });
      setMessages([]); // Clear previous messages when joining a new room
      toast.success(`${username} joined the room!`);
    } else {
      setError("Room ID and Username cannot be empty");
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      const messageData = {
        message,
        room,
        username,
        id: Date.now(), // Unique ID for the message
        timestamp: new Date(),
      };
      socket.emit("send_message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]); // Add message to the local state
      setMessage("");  // Clear the message input
    } else {
      setError("Message cannot be empty");
    }
  };

  const handleTyping = () => {
    setTyping(true);
    socket.emit("typing", { room, username });
    setTimeout(() => setTyping(false), 1000); // Reset typing status after 1 second
  };

  const onDeleteMessage = (msgId) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== msgId));
  };
  

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          message: data.message, 
          username: data.username, 
          timestamp: data.timestamp,
          id: data.id,
        },
      ]);
    });

    socket.on("typing", (data) => {
      if (data.username !== username) {
        setTyping(`${data.username} is typing...`);
      }
    });

    socket.on("room_users", (data) => {
      setUsers(data.users);
    });

    socket.on("user_joined", (message) => {
      toast.info(message); // Toast notification for when a user joins the room
    });

    socket.on("delete_message", (msgId) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== msgId));
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
      socket.off("room_users");
      socket.off("user_joined");
      socket.off("delete_message");
    };
  }, [username]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="App">
      <JoinRoom 
        room={room}
        setRoom={setRoom}
        username={username}
        setUsername={setUsername}
        joinRoom={joinRoom}
        error={error}
      />

      <MessageBox 
        messages={messages} 
        username={username} 
        onDeleteMessage={onDeleteMessage} // Pass delete function as a prop
      />

      <TypingIndicator typing={typing} />

      <MessageInput 
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        handleTyping={handleTyping}
      />

      <UserList users={users} />

      <ToastContainer />
    </div>
  );
}

export default App;
