import React, { useState, useEffect } from 'react';
import bootstrap from 'bootstrap';
import axios from 'axios';

const ViewFriends = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      let { data } = await axios.get('/api/friends/displayFriends');
      setFriends(data);
    };
    console.log(friends);
    fetchFriends();
  }, [friends.length]);

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
