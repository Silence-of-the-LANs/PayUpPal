import React, { useState } from 'react';
import axios from 'axios';
import bootstrap from 'bootstrap';

const AddFriend = () => {
  const [friend, setFriend] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const dataInput = (event) => {
    setFriend({ ...friend, [event.target.name]: event.target.value });
  };

  const submitFriendInfo = async (event) => {
    event.preventDefault();
    try {
      console.log('adding friend...');
      const { data } = await axios.post('api/friends/addFriend', friend);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form className='form-inline'>
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
        <button
          type='submit'
          className='btn btn-primary'
          onClick={submitFriendInfo}
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddFriend;
