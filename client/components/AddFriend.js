import React, { useState } from 'react';
import axios from 'axios';
import bootstrap from 'bootstrap';
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

const AddFriend = (props) => {
  const classes = useStyles();
  const { closeAddModal } = props;
  const [friend, setFriend] = useState(initialState);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const dataInput = (event) => {
    setFriend({ ...friend, [event.target.name]: event.target.value });
  };

  const submitFriendInfo = async (event) => {
    event.preventDefault();
    try {
      setHasSubmitted(true);

      if (hasSubmitted) {
        const { data } = await axios.post('api/friends/addFriend', friend);

        store.addNotification({
          title: '',
          message: `Successfully added to your friend list!`,
          type: 'success',
          insert: 'top',
          container: 'top-left',
          animationIn: ['animate__animated', 'animate__fadeIn'],
          animationOut: ['animate__animated', 'animate__fadeOut'],
          dismiss: {
            duration: 1500,
            onScreen: true,
          },
        });

        if (props.addToFriends) {
          props.addToFriends(data);
        }

        setFriend(initialState);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.root}>
      <form className='form-inline' onSubmit={submitFriendInfo}>
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
          {!friend.name && hasSubmitted && (
            <p style={{ color: 'red', fontSize: '.75rem' }}>
              Name cannot be empty
            </p>
          )}
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
        {!friend.email && !friend.phone && hasSubmitted && (
          <p style={{ color: 'red', fontSize: '.75rem' }}>
            An email or phone number is required
          </p>
        )}
        <button type='submit' className='btn btn-primary'>
          ADD
        </button>
        {closeAddModal ? (
          <button
            type='button'
            className='btn btn-primary'
            onClick={closeAddModal}
          >
            CLOSE
          </button>
        ) : (
          ''
        )}
      </form>
    </div>
  );
};

export default AddFriend;
