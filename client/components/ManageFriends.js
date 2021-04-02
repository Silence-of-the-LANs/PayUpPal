import React, { useState, useEffect } from 'react';
import bootstrap from 'bootstrap';
import axios from 'axios';
import { AddFriend, EditFriend, RemoveFriendPopup } from './index';
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

// const removeFriend = async (friendId) => {
//   const { data } = await axios.put(`api/friends/removeFriend/${friendId}`);
//   return data;
// };

const ManageFriends = () => {
  const [friends, setFriends] = useState([]);
  const [friendInfo, setFriendInfo] = useState({});
  const [friendToRemove, setFriendToRemove] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
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

  const closeRemoveModal = () => {
    setOpenRemove(false);
  };

  const updateFriendList = (data) => {
    setFriends(data);
  };

  const handleRemoveFriend = (friend) => {
    setFriendToRemove(friend);
    setOpenRemove(true);
  };

  return (
    <div className='friends-wrapper'>
      <div className='friends-container'>
        {friends.length > 0 ? (
          friends.map((friend, index) => (
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
                  onClick={() => handleRemoveFriend(friend)}
                >
                  Remove Friend
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>
            <h2>Please add some friends to use this feature.. </h2>
          </div>
        )}
      </div>
      <AddFriend currentFriends={friends} addToFriends={setFriends} />{' '}
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
      <Modal
        className={classes.paper}
        open={openRemove}
        onClose={() => setOpenRemove(false)}
        aria-labelledby='Remove friend'
        aria-describedby='Remove a friend on your friend list'
      >
        <RemoveFriendPopup
          updateFriendList={updateFriendList}
          closeRemoveModal={closeRemoveModal}
          friendToRemove={friendToRemove}
        />
      </Modal>
    </div>
  );
};

export default ManageFriends;
