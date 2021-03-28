import React, { useState, useEffect } from 'react';
import bootstrap from 'bootstrap';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: 'lightgray',
    padding: '1rem',
  },
  formControl: {
    margin: theme.spacing(3),
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
  const { closeSelectModal } = props;
  const checkedFriends = [];
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState(checkedFriends);

  useEffect(() => {
    const fetchFriends = async () => {
      let { data } = await axios.get('/api/friends/displayFriends');
      setFriends(data);
    };

    fetchFriends();

    setSelectedFriends(checkedFriends);
  }, [friends.length]);

  const handleChange = (event) => {
    const isChecked = selectedFriends.some(
      (friend) => friend.id === event.target.id
    );

    if (isChecked) {
      setSelectedFriends(
        selectedFriends.filter((friend) => friend.id !== event.target.id)
      );
    } else {
      setSelectedFriends([
        ...selectedFriends,
        { id: event.target.id, name: event.target.name },
      ]);
    }
  };

  console.log('selectedFriends: ', selectedFriends);

  return (
    <div className={classes.root}>
      <FormControl component='fieldset'>
        <FormLabel component='legend' className={classes.formControl}>
          Select Friends
          <button
            type='submit'
            className='btn btn-primary'
            onClick={() => closeSelectModal(selectedFriends)}
          >
            CONFIRM
          </button>
        </FormLabel>
        <FormHelperText>
          Select friends that are part of this bill
        </FormHelperText>
        <FormGroup>
          {friends.map((friend) => (
            <FormControlLabel
              className={classes.formControl.root}
              key={friend.id}
              control={
                <Checkbox
                  id={friend.id.toString()}
                  checkedIcon={<span className={classes.checkedIcon} />}
                  icon={<span className={classes.icon} />}
                  checked={selectedFriends.some(
                    (selectedFriend) => selectedFriend.id == friend.id
                  )}
                  onChange={handleChange}
                  name={friend.name}
                />
              }
              label={friend.name}
            />
          ))}
        </FormGroup>
      </FormControl>
    </div>
  );
};

export default SelectFriends;
