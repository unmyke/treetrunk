import React from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

export const NavLink = withStyles(styles)(({ classes, path, name }) => (
  <Button
    className={classes.button}
    component={RRNavLink}
    activeClassName={classes.active}
    to={path}>
    {name}
  </Button>
));
