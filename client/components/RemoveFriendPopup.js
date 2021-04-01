import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { store } from 'react-notifications-component';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: 'lightgray',
    padding: '1rem',
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
      container: 'top-left',
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
    <div>
      Are you sure you want to remove this friend?
      <button type='button' onClick={closeRemoveModal}>
        Cancel
      </button>
      <button
        type='button'
        onClick={closeRemoveModal}
        onClick={() =>
          removeSelectedFriend(friendToRemove.id, updateFriendList)
        }
      >
        Confirm
      </button>
    </div>
  );
};

export default RemoveFriendPopup;
