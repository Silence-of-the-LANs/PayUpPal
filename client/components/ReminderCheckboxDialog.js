import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CheckBoxLabels from './Checkboxes';

export default function ReminderCheckboxDialog(props) {
  const { onClose, selectedValue, open } = props;
  const [checkboxContents, setCheckboxContents] = useState({});

  // We use this to obtain the boolean values of the checkboxes in the
  // Checkboxes component
  const getCheckboxContents = (checkboxSelections) => {
    setCheckboxContents(checkboxSelections);
  };

  // This handles the case of the dialog window being closed without a button
  // being pressed
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleButtonClick = (value) => {
    // We use the onClose function we got from the FriendView component through
    // props and pass the button pressed and the values of the checkboxes
    // This results in the value being passed back to the FriendView
    // component where we set selectedValue to that value
    onClose(value, checkboxContents);
  };

  return (
    <Dialog
      open={open}
      // When you click away from the dialog this fires. If this was not here
      // you would need to select an option to close the window
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Please select the method(s) of delivery for the reminder.
        </DialogContentText>
        {/* We send the getCheckboxContents function as a prop */}
        <CheckBoxLabels getCheckboxContents={getCheckboxContents} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleButtonClick('Cancel')} color='primary'>
          Cancel
        </Button>
        <div style={{ flex: '1 0 0' }} />
        <Button
          onClick={() => handleButtonClick('Send')}
          color='primary'
          autoFocus
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}
