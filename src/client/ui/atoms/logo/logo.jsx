import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import paths from 'constants/paths';
import { styles } from './styles';

export const Logo = withStyles(styles)(({ classes, img }) => (
  <div>
    <Link to={paths.get('home')}>
      <img className={classes.logo} src={img} alt="logo" />
    </Link>
  </div>
));
