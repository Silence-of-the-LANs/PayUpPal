import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@material-ui/core/';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReminderCheckboxDialog from './ReminderCheckboxDialog';
import { formatTwoDecimals } from './debtHelperFunctions';

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
  const [grandTotal, setGrandTotal] = useState(0);
  const [friendDebts, setFriendDebts] = useState([]);

  useEffect(() => {
    // initial fetch of debts
    const fetchTotal = async () => {
      let { data } = await axios.get('api/debts/total');
      setGrandTotal(data);
    };

    fetchTotal();
    console.log(grandTotal);
  }, [grandTotal]);

  useEffect(() => {
    // initial fetch of debts
    const fetchData = async () => {
      let { data } = await axios.get('api/debts/displayDebts/friend');
      setFriendDebts(data);
    };

    fetchData();
    setLoaded(true);
  }, []);

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

  const updateADebtByFriend = async (paidStatus, receiptId, friendId) => {
    try {
      // if we are changing a debt to paid, then this route will mark the debt as paid and return the updated data
      if (paidStatus) {
        await axios.put(`api/debts/markReceiptPaid/${receiptId}/${friendId}`);
        const { data } = await axios.get('api/debts/displayDebts/friend');
        setFriendDebts(data);
      } else {
        // if we are changing a debt to unpaid, then this route will mark the debt as unpaid and return the updated data
        await axios.put(`api/debts/markReceiptUnpaid/${receiptId}/${friendId}`);
        const { data } = await axios.get('api/debts/displayDebts/friend');
        setFriendDebts(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return loaded
    ? // create an accordion for each friend
      friendDebts.map((friend) => {
        return (
          <Accordion key={friend.id}>
            <AccordionSummary
              className='accordion-summary'
              expandIcon={<ExpandMoreIcon style={{ fill: '#179be0' }} />}
              aria-controls='panel1a-content'
              id={friend.id}
            >
              <Typography>
                <span className='event-labels'>{friend.name}</span>
              </Typography>
              <Typography>
                <span className='total-labels'> Total Owed: </span>{' '}
                <span className='dollar-labels'>
                  {formatTwoDecimals(friend.total)}
                </span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* create a sub-accordion for each receipt */}
              {friend.receipts.map((receipt) => {
                const allPaid = receipt.debts.every(
                  (debt) => debt.paid === true
                );
                return (
                  <Accordion key={receipt.id}>
                    <AccordionSummary
                      className='accordion-title'
                      expandIcon={
                        <ExpandMoreIcon style={{ fill: '#179be0' }} />
                      }
                      aria-controls='panel1a-content'
                      id={receipt.id}
                    >
                      <Typography className={classes.heading}>
                        <span
                          className={`inner-labels ${allPaid ? 'paid-up' : ''}`}
                        >
                          {receipt.eventName}
                        </span>
                        {<br />}
                        <span className='gray-text'>
                          Total: {formatTwoDecimals(receipt.friendTotal)}
                        </span>

                        {<br />}
                        <Button
                          variant='outlined'
                          color='primary'
                          onClick={() => {
                            handleClickOpen(
                              (receipt.friendTotal / 100).toFixed(2),
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
                        {allPaid ? (
                          <Button
                            className={classes.button}
                            variant='contained'
                            color='primary'
                            onClick={() => {
                              updateADebtByFriend(
                                false,
                                receipt.id,
                                receipt.debts[0].friendId
                              );
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
                            onClick={() => {
                              updateADebtByFriend(
                                true,
                                receipt.id,
                                receipt.debts[0].friendId
                              );
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
                      {/* list out all the items on that receipt */}
                      {receipt.debts.map((owedItem) => {
                        const {
                          balance,
                          proratedTip,
                          proratedTax,
                          item,
                          paid,
                          id,
                        } = owedItem;
                        return (
                          <span
                            key={id}
                            className={`indented listed-item ${
                              paid ? 'paid' : ''
                            }`}
                          >
                            {item.description} - {formatTwoDecimals(balance)}
                            <span className='gray-text'>
                              {` (+${formatTwoDecimals(proratedTip)} tip
                             and ${formatTwoDecimals(proratedTax)} tax)`}
                            </span>
                          </span>
                        );
                      })}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })
    : 'Loading';
};

export default FriendView;
