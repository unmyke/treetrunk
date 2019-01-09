import React from 'react';
import { withStyles } from '@material-ui/core';

import styles from '../styles';

const DictionarySubLayout = ({ classes }) => (
  <main className={classes.layout}>DictionarySubLayout</main>
);

export default withStyles(styles)(DictionarySubLayout);
