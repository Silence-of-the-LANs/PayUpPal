import React, { useContext, useEffect } from 'react';
import axios from 'axios';
// import { UserContext } from '../App';
import { UserContext } from '../Store';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ImageCarousel from './ImageCarousel';

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
  const [user, setUser] = useContext(UserContext);

  return !user ? (
    <ImageCarousel />
  ) : (
    <Grid container direction='column' align='center'>
      <Grid
        item
        container
        className={classes.centerColumn}
        direction='column'
        display='flex'
        justify='center'
      >
        <Typography variant='h2'>You Are Logged In</Typography>
      </Grid>
    </Grid>
  );
};

export default Home;
