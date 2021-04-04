import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import FriendView from './FriendView';
import ReceiptView from './ReceiptView';
import { Button } from '@material-ui/core';

const markPaid = async (debtId) => {
  const { data } = await axios.put(`api/debts/markPaid/${debtId}`);
  return data;
};

const markReceiptPaid = async (receiptId, friendId) => {
  try {
    const { data } = await axios.put(
      `api/debts/markReceiptPaid/${receiptId}/${friendId}`
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

const markReceiptUnpaid = async (receiptId, friendId) => {
  try {
    const { data } = await axios.put(
      `api/debts/markReceiptUnpaid/${receiptId}/${friendId}`
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

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

const calcTotalOwed = (balances) => {
  return balances.reduce((total, balance) => {
    if (!balance.paid) {
      total =
        total + balance.balance + balance.proratedTax + balance.proratedTip;
      return total;
    } else {
      return total;
    }
  }, 0);
};

const ManageDebts = () => {
  const [debts, setDebts] = useState([]);
  const [view, setView] = useState('person');
  const [totalOwed, setTotalOwed] = useState(0);

  const classes = useStyles();

  useEffect(() => {
    // initial data fetch of debts
    const fetchDebts = async () => {
      let { data } = await axios.get(`api/debts/displayDebts/${view}`);
      let total = await axios.get('api/debts/total');

      setDebts(data);
      setTotalOwed(total.data);
    };

    fetchDebts();
  }, [view, totalOwed]);

  // get a unique list of borrowers
  let listOfGroups = debts;
  let listOfGroupIds = [];

  const changeView = async (viewSetting) => {
    const { data } = await axios.get(`api/debts/displayDebts/${viewSetting}`);
    setView(viewSetting);
    setDebts(data);
  };

  return (
    <div className={classes.root}>
      <h2>You are owed a grand total of: ${(totalOwed / 100).toFixed(2)}</h2>
      <br />
      <div id='debt-parent-wrapper'>
        {view === 'receipt' ? (
          <h2 className='debt-header'>Receipt View</h2>
        ) : (
          <h2 className='debt-header'>Friend View</h2>
        )}
        <div id='debt-info-container'>
          <div id='view-by-buttons'>
            <Button
              className={classes.button}
              variant={view === 'person' ? 'contained' : 'outlined'}
              color='primary'
              onClick={() => changeView('person')}
              size='large'
              name={'view-by-person'}
            >
              View by Person
            </Button>
            <Button
              className={classes.button}
              variant={view === 'receipt' ? 'contained' : 'outlined'}
              color='primary'
              onClick={() => changeView('receipt')}
              size='large'
              name={'view-by-person'}
            >
              View by Receipt
            </Button>
          </div>
          {view === 'receipt' ? (
            <ReceiptView
              calcTotalOwed={calcTotalOwed}
              setTotalOwed={setTotalOwed}
              markPaid={markPaid}
              markReceiptPaid={markReceiptPaid}
              markReceiptUnpaid={markReceiptUnpaid}
              total={totalOwed}
              listOfGroups={listOfGroups}
              setDebts={setDebts}
            />
          ) : (
            <FriendView
              calcTotalOwed={calcTotalOwed}
              listOfGroups={listOfGroups}
              debts={debts}
              total={totalOwed}
              setTotalOwed={setTotalOwed}
              markPaid={markPaid}
              markReceiptPaid={markReceiptPaid}
              markReceiptUnpaid={markReceiptUnpaid}
              setDebts={setDebts}
              debts={debts}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDebts;
