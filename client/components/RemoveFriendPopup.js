import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { store } from 'react-notifications-component';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '40%',
    display: 'flex',
    backgroundColor: 'ghostwhite',
    padding: '1rem',
    flexDirection: 'column',
    border: '1px solid #CCCCCC',
    borderRadius: '4px',
    width: 'fit-content',
    height: 'fit-content',
  },
  removeButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  buttons: {
    marginLeft: '5px',
  },
}));

const RemoveFriendPopup = (props) => {
  const classes = useStyles();
  const { friendToRemove, closeRemoveModal, updateFriendList } = props;

  const removeSelectedFriend = async (friendId, updateFunc) => {
    const { data } = await axios.put(`api/friends/removeFriend/${friendId}`);

    closeRemoveModal();

    store.addNotification({
      title: '',
      message: `Friend successfully removed!`,
      type: 'success',
      insert: 'top',
      container: 'top-right',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 1000,
        onScreen: true,
      },
    });

    updateFunc(data);
  };
  return (
    <div className={classes.root}>
      <div>Are you sure you want to remove this friend?</div>
      <div className={classes.removeButtons}>
        <Button
          className={classes.buttons}
          variant='outlined'
          color='primary'
          onClick={closeRemoveModal}
          size='small'
          name={'cancel-remove-friend'}
        >
          CANCEL
        </Button>
        <Button
          className={classes.buttons}
          variant='contained'
          color='secondary'
          onClick={closeRemoveModal}
          onClick={() =>
            removeSelectedFriend(friendToRemove.id, updateFriendList)
          }
          size='small'
          name={'confirm-remove-friend'}
        >
          CONFIRM
        </Button>
      </div>
    </div>
  );
};

export default RemoveFriendPopup;
