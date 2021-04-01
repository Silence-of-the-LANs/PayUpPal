import React, { useState, useEffect } from 'react';
import bootstrap from 'bootstrap';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FriendView from './FriendView';
import ReceiptView from './ReceiptView';

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
    width: '100%',
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
  const [view, setView] = useState('receipt');
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
      <button onClick={() => changeView('person')}>By Person</button>
      <button onClick={() => changeView('receipt')}>By Receipt</button>
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
  );
};

export default ManageDebts;
