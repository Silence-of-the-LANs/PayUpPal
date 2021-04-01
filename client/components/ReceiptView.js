import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
      console.log('useEffect from Receipt', data);
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
                {calcEventTotal(receipt)}
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
                      {friend.name} - Total Owed:{' '}
                      {friend.items.reduce((total, item) => {
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
                      }, 0) / 100}{' '}
                      <button className='button'>Send Reminder (WIP)</button>
                      {friend.items.every((item) =>
                        item.debts.every((debt) => debt.paid === true)
                      ) ? (
                        <button
                          className='button'
                          onClick={async () => {
                            await markReceiptUnpaid(receipt.id, friend.id);
                            setTotalOwed(0);
                            fetchNewdata();
                          }}
                        >
                          Mark as Unpaid
                        </button>
                      ) : (
                        <button
                          className='button'
                          onClick={async () => {
                            await markReceiptPaid(receipt.id, friend.id);
                            setTotalOwed(0);
                            fetchNewdata();
                          }}
                        >
                          Mark as Paid
                        </button>
                      )}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {friend.items.map((item) => (
                      <span
                        key={item.id}
                        className={item.debts[0].paid ? 'paid' : ''}
                      >
                        {item.description} -{' '}
                        {(item.debts[0].balance +
                          item.debts[0].proratedTip +
                          item.debts[0].proratedTax) /
                          100}
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
