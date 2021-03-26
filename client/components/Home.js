import React from 'react';
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
        <Typography variant='h2'>Welcome 2101-FSA-RM-WEB-FT!</Typography>
      </Grid>
    </Grid>
  );
};

export default Home;
