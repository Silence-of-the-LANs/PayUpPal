import React, { useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../App';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  centerColumn: {
    height: 750,
  },
}));

const Home = () => {
  const classes = useStyles();
  const { user, setUser } = useContext(UserContext);
  console.log('The user at home is', user);
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
          <Typography variant='h2'>You Are Logged In</Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Home;
