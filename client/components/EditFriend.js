import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { store } from 'react-notifications-component';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '20%',
    display: 'flex',
    backgroundColor: 'ghostwhite',
    padding: '1rem',
    width: 'fit-content',
    height: 'fit-content',
    border: '1px solid #CCCCCC',
    borderRadius: '4px',
  },
  buttons: {
    marginTop: '5px',
    marginRight: '5px',
  },
}));

const initialState = {
  name: '',
  email: '',
  phone: '',
};

const EditFriend = (props) => {
  const classes = useStyles();
  const { setOpenEdit, friendInfo, closeEditModal, updateFriendList } = props;

  const [friend, setFriend] = useState(friendInfo);

  const dataInput = (event) => {
    setFriend({ ...friend, [event.target.name]: event.target.value });
  };

  const submitEditedFriendInfo = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.put('api/friends/editFriend', friend);

      closeEditModal();

      store.addNotification({
        title: '',
        message: `Information successfully updated!`,
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

      updateFriendList(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.root}>
      <form className='form-inline' onSubmit={submitEditedFriendInfo}>
        <div className='form-group mr-2'>
          <label className='sr-only' htmlFor='inputName'>
            Name
          </label>
          <input
            name='name'
            type='text'
            className='form-control'
            id='inputName'
            placeholder='Name'
            value={friend.name}
            onChange={dataInput}
          />
        </div>
        <div className='form-group mr-2'>
          <label className='sr-only' htmlFor='inputEmail'>
            Email
          </label>
          <input
            name='email'
            type='email'
            className='form-control'
            id='inputEmail'
            placeholder='Email'
            value={friend.email}
            onChange={dataInput}
          />
        </div>
        <div className='form-group mr-2'>
          <label className='sr-only' htmlFor='inputPhone'>
            Phone
          </label>
          <input
            name='phone'
            type='tel'
            className='form-control'
            id='inputPhone'
            placeholder='Phone Number'
            value={friend.phone}
            onChange={dataInput}
          />
          {!friend.email &&
            (isNaN(friend.phone) ||
              (friend.phone && friend.phone.length !== 10)) && (
              <p style={{ color: 'red', fontSize: '.75rem' }}>
                A valid phone number is required
              </p>
            )}
        </div>
        {!friend.email && !friend.phone && (
          <p style={{ color: 'red', fontSize: '.75rem' }}>
            An email or phone number is required
          </p>
        )}
        <Button
          className={classes.buttons}
          variant='contained'
          type='submit'
          color='primary'
          size='small'
          name={'confirm'}
        >
          CONFIRM
        </Button>
        <Button
          className={classes.buttons}
          variant='outlined'
          type='submit'
          color='primary'
          size='small'
          onClick={closeEditModal}
          name={'close'}
        >
          CANCEL
        </Button>
      </form>
    </div>
  );
};

export default EditFriend;
