import React, { useEffect, useState } from 'react';
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
  title: {
    fontSize: 14,
  },
}));

const FriendView = (props) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState(false);
  let {
    setTotalOwed,
    totalOwed,
    calcTotalOwed,
    listOfGroups,
    debt,
    markReceiptPaid,
    setDebts,
    markReceiptUnpaid,
  } = props;

  useEffect(() => {
    // initial data fetch of debts
    const fetchData = async () => {
      let { data } = await axios.get('api/debts/displayDebts/person');
      setDebts(data);
    };
    setLoaded(true);
    fetchData();
  }, [totalOwed]);

  let friendInfo = listOfGroups;

  // For dialog window
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [checkboxContents, setCheckboxContents] = useState({});
  const [reminderInfo, setReminderInfo] = useState({
    total: '',
    receipt: {},
    friend: {},
  });

  const handleClickOpen = (total, receipt, friend) => {
    // We save the info needed for the reminder to state
    setReminderInfo({
      total,
      receipt,
      friend,
    });

    // This opens the dialog window
    setOpen(true);
  };

  // This takes in either "Cancel" or "Send" as a value and the boolean
  // values of the checkboxes in the Checkboxes component which are contained
  // in an object
  const handleClose = (value, checkboxBooleans) => {
    // This sends our reminder to the backend
    const sendReminder = async (reminderInfo) => {
      const { data } = await axios.get('auth/me');
      reminderInfo.userInformation = data;
      const response = await axios.put('api/reminders/send', reminderInfo);
    };

    // This closes the dialog window
    setOpen(false);
    // This sets the selected value to the captured value we got from
    // ReminderCheckboxDialog
    setSelectedValue(value);
    setCheckboxContents(checkboxBooleans);
    reminderInfo.checkboxes = checkboxBooleans;
    // Only send the information gathered if they clicked Send
    if (value === 'Send') {
      sendReminder(reminderInfo);
    }
  };

  return loaded
    ? friendInfo.map((info) => {
        return (
          <Accordion key={info.currentFriend.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography className={classes.heading}>
                {info.currentFriend.name} - $
                {(
                  info.receipts.reduce((total, receipt) => {
                    total += calcTotalOwed(receipt.debts);
                    return total;
                  }, 0) / 100
                ).toFixed(2)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {info.receipts.map((receipt) => (
                <Accordion key={receipt.id}>
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
                        {(calcTotalOwed(receipt.debts) / 100).toFixed(2)}
                      </span>{' '}
                      {<br />}
                      <Button
                        variant='outlined'
                        color='primary'
                        onClick={() => {
                          handleClickOpen(
                            (calcTotalOwed(receipt.debts) / 100).toFixed(2),
                            receipt,
                            info.currentFriend
                          );
                        }}
                        size='small'
                        name={friendInfo.name}
                      >
                        Remind
                      </Button>
                      <ReminderCheckboxDialog
                        open={open}
                        onClose={handleClose}
                        selectedValue={selectedValue}
                        requesteePhoneNumber={!info.currentFriend.phone}
                      />
                      {receipt.debts.every((debt) => debt.paid === true) ? (
                        <Button
                          className={classes.button}
                          variant='contained'
                          color='primary'
                          onClick={async () => {
                            await markReceiptUnpaid(
                              receipt.id,
                              receipt.debts[0].friendId
                            );
                            setTotalOwed(0);
                          }}
                          size='small'
                          name={'mark-as-unpaid'}
                        >
                          Mark Unpaid
                        </Button>
                      ) : (
                        <Button
                          className={classes.button}
                          variant='contained'
                          color='primary'
                          onClick={async () => {
                            await markReceiptPaid(
                              receipt.id,
                              receipt.debts[0].friendId
                            );
                            setTotalOwed(0);
                          }}
                          size='small'
                          name={'mark-as-paid'}
                        >
                          Mark as Paid
                        </Button>
                      )}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {receipt.debts.map((debt) => {
                      return (
                        <span key={debt.id} className={debt.paid ? 'paid' : ''}>
                          {debt.item.description} - $
                          {(
                            (debt.balance +
                              debt.proratedTip +
                              debt.proratedTax) /
                            100
                          ).toFixed(2)}
                        </span>
                      );
                    })}
                  </AccordionDetails>
                </Accordion>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })
    : 'Loading...';
};

export default FriendView;
