import React from 'react';
import PropTypes from 'prop-types';

import { Typography } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

export const TableTitle = withStyles(styles)(({ classes, name, selected }) => (
  <div className={classes.title}>
    {selected ? (
      <Typography color="inherit" variant="subtitle1">
        {selected} selected
      </Typography>
    ) : (
      <Typography variant="h6" id="tableTitle">
        {name}
      </Typography>
    )}
  </div>
));

TableTitle.propTypes = {
  name: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};
