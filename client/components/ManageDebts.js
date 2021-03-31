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
      console.log(data);
      // console.log(total.data);
      setDebts(data);
      setTotalOwed(total.data);
    };

    fetchDebts();
  }, [view, totalOwed]);

  // get a unique list of borrowers
  let listOfGroups = [];
  let listOfGroupIds = [];

  // debts.forEach((balanceObj) => {
  //   // if a borrower is not on the list of borrowers, add them to the list of borrowers

  //   if (view === 'person' && !listOfGroupIds.includes(balanceObj.friendId)) {
  //     listOfGroupIds.push(balanceObj.friendId);
  //     listOfGroups.push({
  //       friendId: balanceObj.friendId,
  //       friendName: balanceObj.friend.name,
  //     });
  //   }
  if (view === 'person') {
    listOfGroups = debts;
  }

  if (view === 'receipt') {
    listOfGroups = debts;
  }
  // });

  // sort the list of borrowers by name
  // listOfGroups.sort((friendOne, friendTwo) => {
  //   if (friendOne.friendName > friendTwo.friendName) {
  //     return 1;
  //   } else if (friendOne.friendName < friendTwo.friendName) {
  //     return -1;
  //   } else {
  //     return 0;
  //   }
  // });

  const changeView = (viewSetting) => {
    setView(viewSetting);
  };

  // console.log('listOfGroups from parent: ', listOfGroups);
  // console.log('listOfGroupsId: ', listOfGroupIds);

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
          total={totalOwed}
          listOfGroups={listOfGroups}
        />
      ) : (
        <FriendView
          calcTotalOwed={calcTotalOwed}
          listOfGroups={listOfGroups}
          debts={debts}
          total={totalOwed}
          setTotalOwed={setTotalOwed}
          markPaid={markPaid}
        />
      )}
    </div>
  );
};

export default ManageDebts;
