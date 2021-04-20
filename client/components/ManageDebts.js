import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import FriendView from './FriendView';
import ReceiptView from './ReceiptView';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '5vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const ManageDebts = () => {
  const [view, setView] = useState('receipt');
  const [totalOwed, setTotalOwed] = useState(0);

  const classes = useStyles();

  useEffect(() => {
    // initial data fetch of debts
    const fetchDebts = async () => {
      let total = await axios.get('api/debts/total');
      setTotalOwed(total.data);
    };

    fetchDebts();
  }, [view, totalOwed]);

  const changeView = async (viewSetting) => {
    setView(viewSetting);
  };

  return (
    <div className={classes.root}>
      {/* <h2>You are owed a grand total of: ${(totalOwed / 100).toFixed(2)}</h2> */}
      {/* <br /> */}
      <div id='debt-parent-wrapper'>
        <h2 className='debt-header'>
          {view === 'receipt' ? 'Receipt View' : 'Friend View'}
        </h2>
        <div id='debt-info-container'>
          <div id='view-by-buttons'>
            <Button
              className={classes.button}
              variant={view === 'friend' ? 'contained' : 'outlined'}
              color='primary'
              onClick={() => changeView('friend')}
              size='large'
              name={'view-by-friend'}
            >
              View by Friend
            </Button>
            <Button
              className={classes.button}
              variant={view === 'receipt' ? 'contained' : 'outlined'}
              color='primary'
              onClick={() => changeView('receipt')}
              size='large'
              name={'view-by-receipt'}
            >
              View by Receipt
            </Button>
          </div>
          {view === 'receipt' ? <ReceiptView /> : <FriendView />}
        </div>
      </div>
    </div>
  );
};

export default ManageDebts;
