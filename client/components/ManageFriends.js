import React, { useState, useEffect } from 'react';
import bootstrap from 'bootstrap';
import axios from 'axios';
import { AddFriend, EditFriend } from './index';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    height: 400,
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const removeFriend = async (friendId) => {
  const { data } = await axios.delete(`api/friends/removeFriend/${friendId}`);
  return data;
};

const ManageFriends = () => {
  const [friends, setFriends] = useState([]);
  const [friendInfo, setFriendInfo] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const fetchFriends = async () => {
      let { data } = await axios.get('/api/friends/displayFriends');
      setFriends(data);
    };

    fetchFriends();
  }, []);

  const handleClick = (friendInfo) => {
    setFriendInfo(friendInfo);
    setOpenEdit(true);
  };

  const closeEditModal = () => {
    setOpenEdit(false);
  };

  const updateFriendList = (data) => {
    setFriends(data);
  };

  return (
    <div className='friends-wrapper'>
      <div className='friends-container'>
        {friends.map((friend, index) => (
          <div className='friend-box' key={friend.id}>
            <div className='friend-info'>
              <p>Name: {friend.name}</p>
              <p>Email: {friend.email}</p>
              <p>Phone: {friend.phone}</p>
            </div>
            <div>
              <button
                type='button'
                className='button'
                onClick={() => {
                  handleClick(friend);
                }}
              >
                Edit Friend
              </button>
              <button
                className='button'
                disabled={friend.name === 'Myself'}
                onClick={async () => setFriends(await removeFriend(friend.id))}
              >
                Remove Friend
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* <AddFriend currentFriends={friends} addToFriends={setFriends} /> */}{' '}
      <Modal
        className={classes.paper}
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        aria-labelledby='Edit friend info'
        aria-describedby='Edit a friend on your friend list'
      >
        <EditFriend
          friendInfo={friendInfo}
          closeEditModal={closeEditModal}
          updateFriendList={updateFriendList}
        />
      </Modal>
    </div>
  );
};

export default ManageFriends;
