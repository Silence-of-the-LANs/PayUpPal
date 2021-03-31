import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const markPaid = async (debtId) => {
  try {
    const { data } = await axios.put(`api/debts/markPaid/${debtId}`);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const FriendView = (props) => {
  const classes = useStyles();
  c;

  let { setTotalOwed, totalOwed, calcTotalOwed, listOfGroups, debts } = props;

  listOfGroups = listOfGroups.filter((group) => group.friendName !== 'Myself');

  return listOfGroups.map((group) => {
    let debtsOwedByFriend = debts.filter(
      (balance) => balance.friendId === group.friendId
    );
    return (
      <Accordion key={group.friendId}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography className={classes.heading}>
            {group.friendName} - $
            {(calcTotalOwed(debtsOwedByFriend) / 100).toFixed(2)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul>
            {debtsOwedByFriend.map((debt) => (
              <li key={debt.id}>
                <span className={debt.paid ? 'paid' : ''}>
                  {debt.receipt.eventName} - Total Owed: $
                  {(
                    (debt.balance + debt.proratedTax + debt.proratedTip) /
                    100
                  ).toFixed(2)}
                </span>{' '}
                <button>Send Reminder (WIP)</button>
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
  });
};

export default FriendView;
