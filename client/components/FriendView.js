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

const markReceiptPaid = async (receiptId, friendId) => {
  try {
    console.log('receiptId: ', receiptId);
    console.log('friendId: ', friendId);
    const { data } = await axios.put(
      `api/debts/markReceiptPaid/${receiptId}/${friendId}`
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

const FriendView = (props) => {
  const classes = useStyles();

  let { setTotalOwed, totalOwed, calcTotalOwed, listOfGroups, debts } = props;

  let friendInfo = listOfGroups.filter(
    (group) => group.friendName !== 'Myself'
  );

  console.log('listy: ', friendInfo);

  return friendInfo.map((info) => {
    return (
      <Accordion key={info.currentFriend.id}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography className={classes.heading}>
            {info.currentFriend.name} -{' '}
            {info.receipts.reduce((total, receipt) => {
              total += calcTotalOwed(receipt.debts);
              return total;
            }, 0) / 100}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {info.receipts.map((receipt) => (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Typography className={classes.heading}>
                  <span
                    className={
                      receipt.debts.every((debt) => debt.paid === true)
                        ? 'paid'
                        : ''
                    }
                  >
                    {receipt.eventName} - Total Owed: ${' '}
                    {calcTotalOwed(receipt.debts) / 100}
                  </span>{' '}
                  <button>Send Reminder (WIP)</button>
                  <button
                    onClick={async () => {
                      await markReceiptPaid(
                        receipt.id,
                        receipt.debts[0].friendId
                      );
                      setTotalOwed(Math.random() * 100);
                    }}
                  >
                    Mark as Paid
                  </button>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {receipt.debts.map((debt) => {
                  return (
                    <span className={debt.paid ? 'paid' : ''}>
                      {debt.item.description} -{' '}
                      {(debt.balance + debt.proratedTip + debt.proratedTax) /
                        100}
                    </span>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionDetails>
      </Accordion>
    );
  });
};

export default FriendView;
