import React from 'react';
import bootstrap from 'bootstrap';

const AddFriend = () => {
  const submitFriendInfo = () => {};

  return (
    <div>
      <form className='form-inline'>
        <div className='form-group mr-2'>
          <label className='sr-only' for='inputEmail'>
            Name
          </label>
          <input
            type='text'
            className='form-control'
            id='inputName'
            placeholder='Name'
          />
        </div>
        <div className='form-group mr-2'>
          <label className='sr-only' for='inputEmail'>
            Email
          </label>
          <input
            type='email'
            className='form-control'
            id='inputEmail'
            placeholder='Email'
          />
        </div>
        <div className='form-group mr-2'>
          <label class='sr-only' for='inputPassword'>
            Phone
          </label>
          <input
            type='password'
            class='form-control'
            id='inputPhone'
            placeholder='phone'
          />
        </div>
        <button
          type='submit'
          class='btn btn-primary'
          onClick={submitFriendInfo}
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddFriend;
