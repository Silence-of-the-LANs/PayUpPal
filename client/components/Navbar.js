import React, { useContext } from 'react';
import { UserContext } from '../App';
import { useHistory } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import DrawerMenu from './DrawerMenu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar() {
  const classes = useStyles();
  const { user, setUser } = useContext(UserContext);
  console.log('The user in the navbar is', user);
  const history = useHistory();
  async function Logout() {
    const loggedinPerson = await axios.get('auth/me');
    console.log('This person is logged in:', loggedinPerson);
    const response = await axios.post('auth/logout');
    const loggedoutPerson = await axios.get('auth/me');
    console.log('This person is logged out:', loggedoutPerson);
    setUser({ userId: response.data });
    history.push('/');
  }

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <DrawerMenu className='hamburger' />
          <Typography variant='h6' className={classes.title}>
            <Link color='inherit' component={RouterLink} to={'/'}>
              PayUpPal
            </Link>
          </Typography>
          {!user ? (
            <>
              <Button color='inherit' component={RouterLink} to={'/signup'}>
                Signup
              </Button>
              <Button color='inherit' component={RouterLink} to={'/login'}>
                Login
              </Button>
            </>
          ) : (
            <Button color='inherit' onClick={Logout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
