import React from 'react';
import { withStyles } from '@material-ui/core';

import styles from '../styles';

const HomeLayout = ({ classes }) => (
  <main className={classes.layout}>Homepage</main>
);

export default withStyles(styles)(HomeLayout);
