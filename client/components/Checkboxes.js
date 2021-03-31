import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function CheckboxLabels() {
  const [checkbox, setCheckbox] = React.useState({
    checkedA: false,
    checkedB: false,
  });

  const handleChange = (event) => {
    setCheckbox({ ...checkbox, [event.target.name]: event.target.checked });
  };

  return (
    <div>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkbox.checkedA}
              onChange={handleChange}
              color='primary'
              name='checkedA'
            />
          }
          label='Email'
        />
      </FormGroup>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkbox.checkedB}
              onChange={handleChange}
              name='checkedB'
              color='primary'
            />
          }
          label='Text Message'
        />
      </FormGroup>
    </div>
  );
}
