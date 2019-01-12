import React from 'react';
import { withStyles, Typography } from '@material-ui/core';

import styles from '../styles';

const DesignSystemLayout = ({ classes }) => (
  <main className={classes.layout}>
    <Typography variant="h1">Design System</Typography>
  </main>
);

export default withStyles(styles)(DesignSystemLayout);
