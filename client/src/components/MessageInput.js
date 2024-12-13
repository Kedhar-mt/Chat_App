// src/components/MessageInput.js
import React from 'react';

const MessageInput = ({ message, setMessage, sendMessage, handleTyping }) => {
  return (
    <div className="input-container container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="input-group">
            <input
              type="text"
              placeholder="Message..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping(); // Trigger typing indicator on every keypress
              }}
              className="form-control"
            />
            <button className="btn btn-success" onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
