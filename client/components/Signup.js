import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link
        color='inherit'
        href='https://github.com/Silence-of-the-LANs/billsplitter/'
      >
        PayUpPal
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Signup() {
  const classes = useStyles();
  const [data, setData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  async function Submit(evt) {
    // Prevent the default action of refreshing the page
    evt.preventDefault();
    const formData = {
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };
    if (formData.confirmPassword !== formData.password) {
      alert('Your passwords do not match');
    }
    console.log(`Your username is: ${formData.username}`);
    console.log(`Your password is: ${formData.password}`);
    console.log(`Your password confirmation is: ${formData.confirmPassword}`);

    // Clear the inputs after the button is pressed
    setData({
      username: '',
      password: '',
      confirmPassword: '',
    });
  }
  const handleChange = (evt) => {
    evt.persist();
    setData({ ...data, [evt.target.name]: evt.target.value });
  };
  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign Up
        </Typography>
        {/* We need to add the onSubmit event listener here */}
        <form className={classes.form} noValidate onSubmit={Submit}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='username'
            label='Username'
            name='username'
            onChange={handleChange}
            value={data.username}
            autoComplete='username'
            autoFocus
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='email'
            onChange={handleChange}
            label='Email'
            type='email'
            value={data.email}
            id='email'
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            onChange={handleChange}
            label='Password'
            type='password'
            value={data.password}
            id='password'
            autoComplete='current-password'
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='confirmPassword'
            onChange={handleChange}
            label='Confirm Password'
            type='password'
            value={data.confirmPassword}
            id='confirmPassword'
            autoComplete='current-password'
          />
          <FormControlLabel
            control={<Checkbox value='remember' color='primary' />}
            label='Remember me'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign Up
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
