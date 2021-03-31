import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../Store';
import { FormControl, Input, TextField } from '@material-ui/core';
import axios from 'axios';

const UserInfo = () => {
  const [user, setUser] = useContext(UserContext);
  const [nameInput, setNameInput] = useState('');
  const [venmoInput, setVenmoInput] = useState('');
  const [paypalInput, setPaypalInput] = useState('');
  const [BTCInput, setBTCInput] = useState('');
  const [noInput, setNoInput] = useState(false);
  const nameInfo = user.name || 'Not submitted';
  const venmoInfo = user.venmoLink || 'Not submitted';
  const paypalInfo = user.paypalLink || 'Not submitted';
  const BTCInfo = user.BTCAddress || 'Not submitted';
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!venmoInput && !paypalInput && !BTCInput) {
      setNoInput(true);
    } else {
      let userInfo = {
        name: nameInput,
        venmoLink: venmoInput,
        paypalLink: paypalInput,
        BTCAddress: BTCInput,
      };
      let filterUserInfo = {};
      Object.keys(userInfo).forEach((key) => {
        if (userInfo[key]) {
          filterUserInfo[key] = userInfo[key];
        }
      });
      const { data } = await axios.put('/api/users/info', filterUserInfo);
      setUser(data);
    }
  };
  return (
    <form
      className='userinfo-form'
      noValidate
      autoComplete='off'
      onSubmit={onSubmit}
    >
      {' '}
      <h2>User Information</h2>
      {noInput && <p style={{ color: 'red' }}>Cannot submit empty inputs</p>}
      <TextField
        id='standard-full-width'
        label='Name'
        style={{ margin: 8 }}
        onChange={(e) => setNameInput(e.target.value)}
        placeholder='Your name here...'
        helperText={`Name: ${nameInfo}`}
        fullWidth
        margin='normal'
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id='standard-full-width'
        label='Venmo Link'
        style={{ margin: 8 }}
        onChange={(e) => setVenmoInput(e.target.value)}
        placeholder='Insert Venmo Link...'
        helperText={`Current Venmo Link: ${venmoInfo}`}
        fullWidth
        margin='normal'
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id='standard-full-width'
        label='Paypal Link Link'
        style={{ margin: 8 }}
        onChange={(e) => setPaypalInput(e.target.value)}
        placeholder='Insert Paypal Link...'
        helperText={`Current Paypal Link: ${paypalInfo}`}
        fullWidth
        margin='normal'
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id='standard-full-width'
        label='Bitcoin address'
        style={{ margin: 8 }}
        onChange={(e) => setBTCInput(e.target.value)}
        placeholder='Insert Bitcoin Address...'
        helperText={`Current BTC Address: ${BTCInfo}`}
        fullWidth
        margin='normal'
        InputLabelProps={{
          shrink: true,
        }}
      />
      <button type='submit'>Submit Info</button>
    </form>
  );
};

export default UserInfo;
