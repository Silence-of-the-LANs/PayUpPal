import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../Store';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import backgroundImage from '../../public/bg.jpeg';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: '100vh',
  },
  centerColumn: {
    height: 750,
  },
}));

const Home = () => {
  const classes = useStyles();
  const [user, setUser] = useContext(UserContext);

  return (
    <Grid container direction='column' align='center'>
      <Grid
        item
        container
        className={classes.centerColumn}
        direction='column'
        display='flex'
        justify='center'
      >
        {!user ? (
          <Typography variant='h2'>You Are Not Logged In</Typography>
        ) : (
          <Typography variant='h2' color='primary'>
            You Are Logged In
          </Typography>
        )}
      </Grid>
      <CssBaseline />
    </Grid>
  );
};

export default Home;
