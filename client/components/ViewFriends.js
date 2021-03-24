import React, { useState, useEffect } from 'react';
import bootstrap from 'bootstrap';
import axios from 'axios';
// show friends from /api/friends/displayFriends route

const ViewFriends = () => {
  const tempFriends = [
    {
      id: 1,
      name: 'jason',
      email: 'email@email.com',
      phone: 1234567890,
    },
    {
      id: 2,
      name: 'david',
      email: 'david@email.com',
      phone: 2234567890,
    },
  ];

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      let { data } = await axios.get('/api/friends/displayFriends');
      console.log(data);
      data = tempFriends;
      setFriends(data);
    };

    fetchFriends();
  }, []);

  return (
    <div className='list-group'>
      <div className='list-heading'>Friend List</div>
      <ul>
        {friends.map((friend) => (
          <li className='list-group-item' key={friend.id}>
            {friend.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewFriends;
