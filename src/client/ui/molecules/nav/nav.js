import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

import { NavLink } from '@ui/atoms';

export const Nav = withStyles(styles)(({ classes, items }) => (
  <nav className={classes.navbar}>
    {items.map(({ name, path, exact }, index) => (
      <NavLink key={index} name={name} path={path} exact={exact} />
    ))}
  </nav>
));
