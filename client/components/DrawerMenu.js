import React, { useContext } from 'react';
import { UserContext } from '../Store';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles({
  list: {
    width: 225,
  },
  fullList: {
    width: 'auto',
  },
  link: {
    fontColor: 'red',
    backgroundColor: 'black',
  },
});

export default function DrawerMenu() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
  });
  const [user, setUser] = useContext(UserContext);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: false,
      })}
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {!user ? (
        <div>
          <div>Welcome</div>
          <Divider />
          <List>
            <NavLink
              style={{ textDecoration: 'none', color: '#3f51b5' }}
              key='Home'
              to={`/home`}
            >
              <ListItem button>
                <ListItemText primary='Home' />
              </ListItem>
            </NavLink>
          </List>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'ghostwhite',
            height: '100vh',
          }}
        >
          <div
            style={{
              color: 'white',
              backgroundColor: '#3f51b5',
              padding: '25px 25px 10px 25px',
            }}
          >
            <p>Welcome</p> <p>{user.email}</p>
          </div>
          <List>
            {[
              { text: 'Home', url: 'home' },
              { text: 'Scan Receipt', url: 'scanreceipt' },
              { text: 'Edit Receipt', url: 'editreceipt' },
              { text: 'Manage Debts', url: 'managedebts' },
              { text: 'Manage Friends', url: 'managefriends' },
              { text: 'Receipt History', url: 'receipthistory' },
              { text: 'User Profile', url: 'userinfo' },
            ].map((listItemObj, index) => (
              <NavLink
                style={{
                  textDecoration: 'none',
                  color: '#3f51b5',
                }}
                activeStyle={{ fill: 'red' }}
                key={listItemObj.text}
                to={`/${listItemObj.url}`}
              >
                <ListItem
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(event, index)}
                  autoFocus
                  button
                  key={listItemObj.text}
                >
                  <ListItemText primary={listItemObj.text} />
                </ListItem>
              </NavLink>
            ))}
          </List>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <React.Fragment key={'left'}>
        <Button onClick={toggleDrawer('left', true)}>
          <MenuIcon style={{ color: `white` }} />
        </Button>
        <Drawer
          anchor={'left'}
          open={state['left']}
          onClose={toggleDrawer('left', false)}
        >
          {list('left')}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
