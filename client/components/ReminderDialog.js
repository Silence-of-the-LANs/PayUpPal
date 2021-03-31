import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ReminderDialog(props) {
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
      <DialogTitle id='alert-dialog-title'>
        {'Send Tommy a reminder email?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Do want to send Tommy a reminder email?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleButtonClick('No')} color='primary'>
          No
        </Button>
        <Button
          onClick={() => handleButtonClick('Yes')}
          color='primary'
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
