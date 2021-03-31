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

const ReceiptView = (props) => {
  const classes = useStyles();
  const {
    listOfGroups,
    calcTotalOwed,
    setTotalOwed,
    markPaid,
    totalOwed,
  } = props;

  console.log('here data:', listOfGroups);

  return listOfGroups.map((receipt) => {
    return (
      <Accordion key={receipt.id}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography className={classes.heading}>
            Event: {receipt.eventName} Date: {receipt.date} - Total Owed:{' '}
            {/* {calcTotalOwed(receipt.debts) / 100} */}
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
                {friend.items.map((item) => (
                  <span className={item.debts[0].paid ? 'paid' : ''}>
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
  });
};

export default ReceiptView;
