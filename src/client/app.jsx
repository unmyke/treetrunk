import React from 'react';
import { Switch } from 'react-router-dom';

import 'modern-normalize';
import 'typeface-roboto';
import { CssBaseline } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { rootRoutes } from './routes';

import styles from './styles';

const routes = rootRoutes();
// console.log(routes);

const App = withStyles(styles)(({ classes }) => (
  <div className={classes.layout}>
    <CssBaseline />
    <Switch>{routes}</Switch>
  </div>
));

export default App;
