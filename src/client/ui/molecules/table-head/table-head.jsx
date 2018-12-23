import React from 'react';
import PropTypes from 'prop-types';

import {
  TableCell,
  TableHead as MUTableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
  Tooltip,
} from '@material-ui/core';

const createSortHandler = (property, onRequestSort) => (event) => {
  onRequestSort(event, property);
};

export const TableHead = ({
  classes,
  headers,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
}) => (
  <MUTableHead>
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox
          indeterminate={numSelected > 0 && numSelected < rowCount}
          checked={numSelected === rowCount}
          onChange={onSelectAllClick}
        />
      </TableCell>
      {headers.map(({ id, type, disablePadding, label, description }) => {
        return (
          <TableCell
            key={id}
            numeric={type.isNumeric}
            padding={disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === id ? order : false}>
            <Tooltip
              title={description}
              placement={type.isNumeric ? 'bottom-end' : 'bottom-start'}
              enterDelay={300}>
              <TableSortLabel
                active={orderBy === id}
                direction={order}
                onClick={createSortHandler(id, onRequestSort)}>
                {label}
              </TableSortLabel>
            </Tooltip>
          </TableCell>
        );
      }, this)}
    </TableRow>
  </MUTableHead>
);

TableHead.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.shape({
        name: PropTypes.string.isRequired,
        isNumeric: PropTypes.bool.isRequired,
        value: PropTypes.func.isRequired,
      }).isRequired,
      disablePadding: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
