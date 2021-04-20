import React, { useState, useEffect } from 'react';
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
    width: '50%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const ReceiptView = (props) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState(false);
  const [receiptDebts, setReceiptDebts] = useState([]);

  useEffect(() => {
    // initial data fetch of debts
    const fetchData = async () => {
      let { data } = await axios.get('api/debts/displayDebts/receipt');
      setReceiptDebts(data);
    };
    setLoaded(true);
    fetchData();
  }, []);

  // For dialog window
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [checkboxContents, setCheckboxContents] = useState({});
  const [expanded, setExpanded] = useState(true);
  const [reminderInfo, setReminderInfo] = useState({
    total: '',
    receipt: {},
    friend: {},
  });

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

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

  const updateADebtByReceipt = async (paidStatus, receiptId, friendId) => {
    try {
      // if we are changing a debt to paid, then this route will mark the debt as paid and fetch the updated data
      if (paidStatus) {
        await axios.put(`api/debts/markReceiptPaid/${receiptId}/${friendId}`);
        const { data } = await axios.get('api/debts/displayDebts/receipt');
        setReceiptDebts(data);
      } else {
        // if we are changing a debt to unpaid, then this route will mark the debt as unpaid and fetch the updated data
        await axios.put(`api/debts/markReceiptUnpaid/${receiptId}/${friendId}`);
        const { data } = await axios.get('api/debts/displayDebts/receipt');
        setReceiptDebts(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return loaded
    ? receiptDebts.map((receipt) => {
        return (
          <Accordion key={receipt.id}>
            <AccordionSummary
              className={`test-content ${classes.content}`}
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id={receipt.id}
            >
              <Typography className={classes.heading}>
                <span className='event-labels'>
                  {receipt.eventName} - {receipt.date}
                </span>
              </Typography>
              <Typography className={classes.heading}>
                <span className='total-labels'>Total Owed: </span>{' '}
                <span className='dollar-labels'>
                  {formatTwoDecimals(receipt.receiptUnpaidTotal)}
                </span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {receipt.friends.map((friend) => {
                const { id, name, items, friendUnpaidTotal } = friend;
                return (
                  <Accordion key={id}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls='panel1a-content'
                      id={id}
                    >
                      <Typography className={classes.heading}>
                        <span className='inner-labels'>
                          {name}
                          {<br />}
                        </span>
                        <span className='gray-text'>
                          Total: {formatTwoDecimals(friendUnpaidTotal)}
                        </span>
                        {<br />}
                        {<br />}
                        <Button
                          variant='outlined'
                          color='primary'
                          onClick={() => {
                            handleClickOpen(
                              (friendUnpaidTotal / 100).toFixed(2),
                              receipt,
                              friend
                            );
                          }}
                          size='small'
                          name={name}
                        >
                          Remind
                        </Button>
                        <ReminderCheckboxDialog
                          open={open}
                          onClose={handleClose}
                          selectedValue={selectedValue}
                          requesteePhoneNumber={!friend.phone}
                        />
                        {/* for every item, we will check to see if all of that item's debts have been repaid */}
                        {items.every((item) =>
                          item.debts.every((debt) => debt.paid === true)
                        ) ? (
                          <Button
                            className={classes.button}
                            variant='contained'
                            color='primary'
                            onClick={() => {
                              updateADebtByReceipt(
                                false,
                                receipt.id,
                                friend.id
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
                              updateADebtByReceipt(true, receipt.id, friend.id);
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
                      {items.map((item) => {
                        const { id, description } = item;
                        const {
                          balance,
                          proratedTax,
                          proratedTip,
                          paid,
                        } = item.debts[0];
                        return (
                          <span
                            key={id}
                            className={`indented listed-item ${
                              paid ? 'paid' : ''
                            }`}
                          >
                            {description} - {formatTwoDecimals(balance)}
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
    : 'Loading...';
};

export default ReceiptView;
