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
            {calcTotalOwed(receipt.debts) / 100}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul>
            {receipt.debts.map((debt) => {
              return (
                <li key={debt.id}>
                  <span className={debt.paid ? 'paid' : ''}>
                    {debt.itemName} ({debt.friendName}) -{' '}
                    {(debt.balance + debt.proratedTax + debt.proratedTip) / 100}
                  </span>
                  <button>Send Reminder (WIP)</button>
                  <button
                    onClick={async () => {
                      console.log('this', await markPaid(debt.id));
                      setTotalOwed(Math.random() * 100);
                    }}
                  >
                    Mark as Paid
                  </button>
                </li>
              );
            })}
          </ul>
        </AccordionDetails>
      </Accordion>
    );
  });
};

export default ReceiptView;
