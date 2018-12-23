import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { Logo } from '../../atoms';
import { Nav } from '../../molecules';

import styles from './styles';

export const Header = withStyles(styles)(({ classes }) => (
  <AppBar color="default" className={classes.header}>
    <Toolbar>
      <Logo />
      <Nav />
    </Toolbar>
  </AppBar>
));
