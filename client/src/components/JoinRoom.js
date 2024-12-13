// src/components/JoinRoom.js
import React from 'react';

const JoinRoom = ({ room, setRoom, username, setUsername, joinRoom, error }) => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="join-container">
            <div className="mb-3">
              <input
                placeholder="Room Number..."
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                placeholder="Your Username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
              />
            </div>
            <button className="btn btn-primary w-100" onClick={joinRoom}>Join Room</button>
            {error && <p className="text-danger mt-3">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
