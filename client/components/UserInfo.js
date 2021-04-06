import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { UserContext } from '../Store';
import { FormControl, Input, TextField, Button } from '@material-ui/core';
import axios from 'axios';
import { store } from 'react-notifications-component';

const UserInfo = () => {
  const history = useHistory();
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
      setNoInput(false);
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
      store.addNotification({
        title: '',
        message: `User information has been updated`,
        type: 'success',
        insert: 'bottom',
        container: 'top-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 1500,
          onScreen: true,
        },
      });
      history.push('/home');
    }
  };
  return (
    <form
      id='userinfo-id'
      className='userinfo-form'
      noValidate
      autoComplete='off'
      onSubmit={onSubmit}
    >
      <div id='userinfo-div'>
        <h2>User Information</h2>
      </div>
      {noInput && (
        <p style={{ color: 'red' }}>
          Venmo, Paypal and BTC must contain at least one non-empty input
        </p>
      )}
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
      <Button
        id='userinfo-submit-button'
        // className={classes.button}
        variant='contained'
        color='primary'
        size='small'
        // name={'view-by-person'}
        onClick={onSubmit}
      >
        Submit
      </Button>
    </form>
  );
};

export default UserInfo;
