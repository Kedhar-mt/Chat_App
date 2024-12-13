// src/components/UserList.js
import React from 'react';

const UserList = ({ users }) => {
  return (
    <div className="user-list mt-4">
      <h5>Users in Room:</h5>
      <ul className="list-group">
        {users.map((user, index) => (
          <li key={index} className="list-group-item">
            {user}
          </li>
        ))}
      </ul>
      <p className="mt-3">{users.length} user(s) in the room</p>
    </div>
  );
};

export default UserList;
