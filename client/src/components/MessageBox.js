import React from 'react';
import { FaTrash } from 'react-icons/fa';

const MessageBox = ({ messages, username, onDeleteMessage }) => {
  return (
    <div className="message-box">
      {messages.map((msg) => (
        <div key={msg.id} className={`message ${msg.username === username ? 'me' : ''}`}>
          <div className="message-content">
            <span className="username">{msg.username}</span>: {msg.message}
            <span className="timestamp p-2 text-warning">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
          {/* Trash Icon for Message Deletion */}
          <button 
            className="delete-icon" 
            onClick={() => onDeleteMessage(msg.id)} 
            title="Delete for me only"
          >
            <FaTrash size={16} color="#dc3545" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default MessageBox;
