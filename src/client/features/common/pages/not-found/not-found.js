import React from 'react';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import styles from './styles';

export const NotFoundPage = withRouter(
  withStyles(styles)(({ classes, location: { pathname } }) => (
    <main className={classes.layout}>
      <h1>Look like path "{pathname}" does not exist</h1>
    </main>
  ))
);
