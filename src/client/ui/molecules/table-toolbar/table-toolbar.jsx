import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { Toolbar } from '@material-ui/core';
import { TableActionController } from '../table-action-controller';
import { TableTitle } from 'ui/atoms';

import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

export const TableToolbar = withStyles(styles)(
  ({ classes, name, selected, actions }) => {
    const { length: numSelected = 0 } = selected;

    return (
      <Toolbar
        className={cn(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}>
        <TableTitle name={name} selected={numSelected > 0} />
        <div className={classes.spacer} />
        <TableActionController selected={selected} actions={actions} />
      </Toolbar>
    );
  }
);

TableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  selected: PropTypes.arrayOf(PropTypes.object).isRequired,
  actions: PropTypes.arrayOf(PropTypes.node).isRequired,
};
