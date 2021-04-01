import React, { useState } from 'react';
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
        </div>
        <button type='submit' className='btn btn-primary'>
          CONFIRM
        </button>
        <button
          type='button'
          className='btn btn-primary'
          onClick={closeEditModal}
        >
          CANCEL
        </button>
      </form>
    </div>
  );
};

export default EditFriend;
