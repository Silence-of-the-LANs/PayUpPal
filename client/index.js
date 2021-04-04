import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import Store from './Store';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#179be0;', // This is an orange looking color
    },
    secondary: {
      main: '#F50057', //Another orange-ish color
    },
  },
  fontFamily: 'Roboto', // as an aside, highly recommend importing roboto font for Material UI projects! Looks really nice
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Store>
      <Router>
        <App />
      </Router>
    </Store>
  </ThemeProvider>,
  document.getElementById('app')
);
