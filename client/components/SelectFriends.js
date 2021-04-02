import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize='medium' />;
const checkedIcon = <CheckBoxIcon fontSize='medium' />;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'white',
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
  icon: {
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow:
      'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
  },
}));

const SelectFriends = (props) => {
  const classes = useStyles();
  const { closeSelectModal, updatePool } = props;
  const checkedFriends = [];
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState(checkedFriends);

  useEffect(() => {
    const fetchFriends = async () => {
      let { data } = await axios.get('/api/friends/displayListOfFriends');
      setFriends(data);
    };

    fetchFriends();

    setSelectedFriends(checkedFriends);
  }, [friends.length]);

  const handleChange = (event, value) => {
    setSelectedFriends(value);
    updatePool(value);
  };

  return (
    <Autocomplete
      className={classes.root}
      noOptionsText='Please add some friends...'
      multiple
      onChange={handleChange}
      id='autocomplete'
      options={friends}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      renderOption={(option, state) => (
        <React.Fragment>
          <Checkbox
            checkedIcon={<span className={classes.checkedIcon} />}
            icon={<span className={classes.icon} />}
            checked={state.selected}
          />
          {option.name}
        </React.Fragment>
      )}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant='outlined'
          label='Friends List'
          placeholder='Select friends...'
        />
      )}
    />
  );
};

export default SelectFriends;
