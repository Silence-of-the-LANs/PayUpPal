import React, { useState } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function CheckboxLabels(props) {
  const { getCheckboxContents } = props;
  const [checkboxValues, setCheckboxValues] = useState({
    email: false,
    textMessage: false,
  });
  const [textMessageState, setTextMessageState] = useState(true);

  React.useEffect(() => {
    getCheckboxContents(checkboxValues);
  });

  const handleChange = (event) => {
    setCheckboxValues({
      ...checkboxValues,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <div>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkboxValues.email}
              onChange={handleChange}
              color='primary'
              name='email'
            />
          }
          label='Email'
        />
      </FormGroup>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkboxValues.textMessage}
              onChange={handleChange}
              name='textMessage'
              color='primary'
              disabled={textMessageState}
            />
          }
          label='Text Message'
        />
      </FormGroup>
    </div>
  );
}
