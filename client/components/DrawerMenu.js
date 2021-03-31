import React, { useContext } from 'react';
import { UserContext } from '../Store';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function DrawerMenu() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
  });
  const [user, setUser] = useContext(UserContext);

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
            <Link key='Home' to={`/home`}>
              <ListItem button>
                <ListItemText primary='Home' />
              </ListItem>
            </Link>
          </List>
        </div>
      ) : (
        <div>
          <div>Welcome {user.email}</div>
          <Divider />
          <List>
            {[
              { text: 'Home', url: 'home' },
              { text: 'Scan Receipt', url: 'scanreceipt' },
              { text: 'Edit Receipt', url: 'editreceipt' },
              { text: 'Manage Debts', url: 'managedebts' },
              { text: 'Manage Friends', url: 'managefriends' },
              { text: 'Receipt History', url: 'receipthistory' },
            ].map((listItemObj, index) => (
              <Link key={listItemObj.text} to={`/${listItemObj.url}`}>
                <ListItem button key={listItemObj.text}>
                  <ListItemText primary={listItemObj.text} />
                </ListItem>
              </Link>
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
          <MenuIcon />
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
