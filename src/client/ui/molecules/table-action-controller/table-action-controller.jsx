import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

export const TableActionController = withStyles(styles)(
  ({ classes, selected, actions }) => (
    <div className={classes.actions}>
      {actions.map((Action, index) => (
        <Action key={index} rows={selected} />
      ))}
    </div>
  )
);

TableActionController.propTypes = {
  classes: PropTypes.object.isRequired,
  selected: PropTypes.arrayOf(PropTypes.object).isRequired,
  actions: PropTypes.arrayOf(PropTypes.node).isRequired,
};
