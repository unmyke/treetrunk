import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import styles from './styles';

export const Footer = withStyles(styles)(({ classes }) => (
  <footer className={classes.footer}>Footer</footer>
));
