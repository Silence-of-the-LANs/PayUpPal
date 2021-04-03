import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import Store from './Store';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3F51B5', // This is an orange looking color
    },
    secondary: {
      main: '#F44336', //Another orange-ish color
    },
  },
  fontFamily: 'Roboto',
});
// ffcc80; orange colors
// ff8f00;
ReactDOM.render(
  <Store>
    <Router>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </Store>,
  document.getElementById('app')
);
