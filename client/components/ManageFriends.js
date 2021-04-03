import React, { useState, useEffect } from 'react';
import bootstrap from 'bootstrap';
import axios from 'axios';
import { AddFriend, EditFriend, RemoveFriendPopup } from './index';
import {
  Modal,
  Typography,
  Card,
  CardActions,
  CardContent,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'relative',
    width: 'fit-content',
    height: 'fit-content',
    backgroundColor: 'white',
    // border: '2px solid #000',
    // boxShadow: theme.shadows[5],
    padding: '4px',
  },
  root: {
    minWidth: 275,
    margin: 10,
    backgroundColor: 'ghostwhite',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

// const removeFriend = async (friendId) => {
//   const { data } = await axios.put(`api/friends/removeFriend/${friendId}`);
//   return data;
// };

const ManageFriends = () => {
  const [friends, setFriends] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
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

  const closeAddModal = () => {
    setOpenAdd(false);
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
      <div id='manage-friends-add-button'>
        <Button
          className='edit-receipt-friend-buttons'
          variant='text'
          color='primary'
          onClick={() => {
            setOpenAdd(true);
          }}
          size='large'
          name={'add-a-friend'}
        >
          Add a Friend
        </Button>
      </div>
      <div className='friends-container'>
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <Card className={classes.root} key={friend.id}>
              <CardContent>
                <Typography
                  className={classes.title}
                  color='textSecondary'
                  gutterBottom
                >
                  Friend
                </Typography>
                <Typography variant='h5' component='h2'>
                  {friend.name}
                </Typography>
                <Typography className={classes.pos} color='textSecondary'>
                  {friend.email || 'No email added'}
                </Typography>
                <Typography variant='body2' component='p'>
                  Phone: {friend.phone || 'No number added'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    handleClick(friend);
                  }}
                  size='small'
                  name={'edit-friend'}
                >
                  Edit Friend
                </Button>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => handleRemoveFriend(friend)}
                  size='small'
                  name={'remove-friend'}
                >
                  Remove Friend
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <div>
            <h2>Please add some friends to use this feature.. </h2>
          </div>
        )}
      </div>
      <Modal
        className={classes.paper}
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        aria-labelledby='Add a friend'
        aria-describedby='Add a friend to your friend list'
      >
        <AddFriend
          closeAddModal={closeAddModal}
          currentFriends={friends}
          addToFriends={setFriends}
        />
      </Modal>
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
