import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReminderCheckboxDialog from './ReminderCheckboxDialog';
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

  // For dialog window
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [checkboxContents, setCheckboxContents] = useState({});

  const handleClickOpen = () => {
    // This opens the dialog window
    setOpen(true);
  };

  // This takes in either "Cancel" or "Send" as a value and the boolean
  // values of the checkboxes in the Checkboxes component which are contained
  // in an object
  const handleClose = (value, checkboxBooleans) => {
    // This closes the dialog window
    setOpen(false);
    // This sets the selected value to the captured value we got from
    // ReminderCheckboxDialog
    setSelectedValue(value);
    setCheckboxContents(checkboxBooleans);
  };

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
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={handleClickOpen}
                    size='small'
                  >
                    Remind
                  </Button>
                  <ReminderCheckboxDialog
                    open={open}
                    onClose={handleClose}
                    selectedValue={selectedValue}
                  />
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
