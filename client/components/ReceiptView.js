import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReminderCheckboxDialog from './ReminderCheckboxDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const calcEventTotal = (receipt) => {
  let eventTotal = 0;

  receipt.friends.forEach((friend) => {
    let items = friend.items;

    for (let i = 0; i < items.length; i++) {
      let currentDebt = items[i].debts[0];

      if (!currentDebt.paid) {
        eventTotal +=
          currentDebt.balance +
          currentDebt.proratedTip +
          currentDebt.proratedTax;
      }
    }
  });

  return eventTotal / 100;
};

const ReceiptView = (props) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState(false);
  const {
    listOfGroups,
    calcTotalOwed,
    setTotalOwed,
    markPaid,
    totalOwed,
    markReceiptPaid,
    markReceiptUnpaid,
    setDebts,
    debts,
  } = props;

  useEffect(() => {
    // initial data fetch of debts
    const fetchData = async () => {
      let { data } = await axios.get('api/debts/displayDebts/receipt');
      setDebts(data);
    };
    setLoaded(true);
    fetchData();
  }, [totalOwed, debts]);

  const fetchNewdata = async () => {
    let { data } = await axios.get('api/debts/displayDebts/receipt');
    console.log('fetchingNewData');
    setDebts(data);
  };

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
    // This attaches the checkbox values to our reminder information
    reminderInfo.checkboxes = checkboxBooleans;
    // Only send the information gathered if they clicked Send
    if (value === 'Send') {
      sendReminder(reminderInfo);
    }
  };

  return loaded
    ? listOfGroups.map((receipt) => {
        return (
          <Accordion key={receipt.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography className={classes.heading}>
                Event: {receipt.eventName} Date: {receipt.date} - Total Owed: $
                {calcEventTotal(receipt).toFixed(2)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {receipt.friends.map((friend) => (
                <Accordion key={friend.id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                  >
                    <Typography className={classes.heading}>
                      {friend.name}'s' Total: $
                      {(
                        friend.items.reduce((total, item) => {
                          if (!item.debts[0].paid) {
                            total =
                              total +
                              item.debts[0].balance +
                              item.debts[0].proratedTip +
                              item.debts[0].proratedTax;
                            return total;
                          } else {
                            return total;
                          }
                        }, 0) / 100
                      ).toFixed(2)}{' '}
                      <Button
                        variant='outlined'
                        color='primary'
                        onClick={() => {
                          handleClickOpen(
                            (
                              friend.items.reduce((total, item) => {
                                if (!item.debts[0].paid) {
                                  total =
                                    total +
                                    item.debts[0].balance +
                                    item.debts[0].proratedTip +
                                    item.debts[0].proratedTax;
                                  return total;
                                } else {
                                  return total;
                                }
                              }, 0) / 100
                            ).toFixed(2),

                            receipt,
                            friend
                          );
                        }}
                        size='small'
                        name={friend.name}
                      >
                        Remind
                      </Button>
                      <ReminderCheckboxDialog
                        open={open}
                        onClose={handleClose}
                        selectedValue={selectedValue}
                        requesteePhoneNumber={!friend.phone}
                      />
                      {friend.items.every((item) =>
                        item.debts.every((debt) => debt.paid === true)
                      ) ? (
                        <Button
                          className={classes.button}
                          variant='contained'
                          color='primary'
                          onClick={async () => {
                            await markReceiptUnpaid(receipt.id, friend.id);
                            setTotalOwed(0);
                            fetchNewdata();
                          }}
                          size='small'
                          name={'mark-as-unpaid'}
                        >
                          Mark as Unpaid
                        </Button>
                      ) : (
                        <Button
                          className={classes.button}
                          variant='contained'
                          color='primary'
                          onClick={async () => {
                            await markReceiptPaid(receipt.id, friend.id);
                            setTotalOwed(0);
                            fetchNewdata();
                          }}
                          size='small'
                          name={'mark-as-unpaid'}
                        >
                          Mark as Paid
                        </Button>
                      )}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {friend.items.map((item) => (
                      <span
                        key={item.id}
                        className={item.debts[0].paid ? 'paid' : ''}
                      >
                        {item.description} - $
                        {(
                          (item.debts[0].balance +
                            item.debts[0].proratedTip +
                            item.debts[0].proratedTax) /
                          100
                        ).toFixed(2)}
                      </span>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })
    : 'Loading...';
};

export default ReceiptView;
