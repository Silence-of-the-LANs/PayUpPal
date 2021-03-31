import React, { useState, useEffect } from 'react';
import bootstrap from 'bootstrap';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ReminderDialog from './ReminderDialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
      total = total + balance.balance;
      return total;
    } else {
      return total;
    }
  }, 0);
};

const ViewDebts = () => {
  const [debts, setDebts] = useState([]);
  const [totalOwed, setTotalOwed] = useState(0);

  //For dialog window
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const classes = useStyles();

  useEffect(() => {
    // initial data fetch of debts
    const fetchDebts = async () => {
      let { data } = await axios.get('api/debts/displayDebts');
      const total = calcTotalOwed(data);

      setDebts(data);
      setTotalOwed(total);
    };

    fetchDebts();
  }, [totalOwed]);

  // get a unique list of borrowers
  const listOfBorrowers = [];
  const listOfBorrowerIds = [];

  debts.forEach((balanceObj) => {
    // if a borrower is not on the list of borrowers, add them to the list of borrowers
    if (!listOfBorrowerIds.includes(balanceObj.friendId)) {
      listOfBorrowerIds.push(balanceObj.friendId);
      listOfBorrowers.push({
        friendId: balanceObj.friendId,
        friendName: balanceObj.friend.name,
      });
    }
  });

  // sort the list of borrowers by name
  listOfBorrowers.sort((friendOne, friendTwo) => {
    if (friendOne.friendName > friendTwo.friendName) {
      return 1;
    } else if (friendOne.friendName < friendTwo.friendName) {
      return -1;
    } else {
      return 0;
    }
  });

  return (
    <div className={classes.root}>
      <h2>You are owed a grand total of: ${(totalOwed / 100).toFixed(2)}</h2>
      <h3>You selected: {selectedValue}</h3>
      {listOfBorrowers.map((borrower) => {
        let debtsOwedByFriend = debts.filter(
          (balance) => balance.friendId === borrower.friendId
        );
        return (
          <Accordion key={borrower.friendId}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography className={classes.heading}>
                {borrower.friendName} - $
                {(calcTotalOwed(debtsOwedByFriend) / 100).toFixed(2)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ul>
                {debtsOwedByFriend.map((debt) => (
                  <li key={debt.id}>
                    <span className={debt.paid ? 'paid' : ''}>
                      Event Name - Total Owed: $
                      {(debt.balance / 100).toFixed(2)}
                    </span>{' '}
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={handleClickOpen}
                      size='small'
                    >
                      Remind
                    </Button>
                    <ReminderDialog
                      selectedValue={selectedValue}
                      open={open}
                      onClose={handleClose}
                    />
                    <button
                      onClick={async () =>
                        setTotalOwed(calcTotalOwed(await markPaid(debt.id)))
                      }
                    >
                      Mark as Paid
                    </button>
                  </li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

export default ViewDebts;
