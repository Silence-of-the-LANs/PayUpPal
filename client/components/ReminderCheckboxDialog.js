import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CheckBoxLabels from './Checkboxes';

export default function ReminderCheckboxDialog(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleButtonClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      {/* <DialogTitle id="alert-dialog-title">
        {"Send Tommy a reminder email?"}
      </DialogTitle> */}
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Please select the method(s) of delivery for the reminder.
        </DialogContentText>
        <CheckBoxLabels />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleButtonClick('Cancel')} color='primary'>
          No
        </Button>
        <Button
          onClick={() => handleButtonClick('Send')}
          color='primary'
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
