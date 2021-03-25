import React, { useState, useEffect } from 'react';
import bootstrap from 'bootstrap';
import axios from 'axios';
import AddFriend from './AddFriend';

const removeFriend = async (friendId) => {
  const { data } = await axios.delete(`api/friends/removeFriend/${friendId}`);
  return data;
};
const ManageFriends = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      let { data } = await axios.get('/api/friends/displayFriends');
      setFriends(data);
    };

    fetchFriends();
  }, []);

  return (
    <div className='friends-wrapper'>
      <div className='friends-container'>
        {friends.map((friend) => (
          <div key={friend.id}>
            {friend.name}
            <button
              onClick={async () => setFriends(await removeFriend(friend.id))}
            >
              Remove Friend
            </button>
          </div>
        ))}
      </div>
      <AddFriend />
    </div>
  );
};

export default ManageFriends;
