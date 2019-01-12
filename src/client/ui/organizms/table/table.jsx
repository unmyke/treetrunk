import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  Table as MUTable,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Paper,
  Checkbox,
} from '@material-ui/core';
import { TableHead, TableToolbar } from '@ui/molecules';

import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

import { stableSort, getSorting, getItemValue } from '@lib/table-helpers';

export const Table = withStyles(styles)(
  class Table extends Component {
    static propTypes = {
      classes: PropTypes.object.isRequired,
      name: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.object).isRequired,
      actions: PropTypes.arrayOf(PropTypes.node).isRequired,
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
      orderBy: PropTypes.string.isRequired,
    };

    constructor(props) {
      super(props);
      this.state = {
        data: props.data,
        order: 'asc',
        orderBy: props.orderBy,
        selected: [],
        page: 0,
        rowsPerPage: 5,
        editMode: false,
      };
    }

    handleRequestSort = (_, property) => {
      const orderBy = property;
      const order =
        this.state.orderBy === property && this.state.order === 'desc'
          ? 'asc'
          : 'desc';

      this.setState({ order, orderBy });
    };

    handleSelectAllClick = (event) => {
      if (event.target.checked) {
        this.setState((state) => ({
          selected: state.data.map(({ id }) => id),
        }));
        return;
      }
      this.setState({ selected: [] });
    };

    handleClick = (_, id) => {
      const { selected } = this.state;
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }

      this.setState({ selected: newSelected });
    };

    handleChangePage = (_, page) => {
      this.setState({ page });
    };

    handleChangeRowsPerPage = (event) => {
      this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = (id) => this.state.selected.indexOf(id) !== -1;

    render() {
      const { classes, name, headers, actions } = this.props;
      const {
        data,
        order,
        orderBy,
        selected,
        rowsPerPage,
        page,
        editMode,
      } = this.state;
      const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

      const [firstCell, ...restHeaders] = headers;

      return (
        <Paper className={classes.root}>
          <TableToolbar name={name} selected={selected} actions={actions} />
          <div className={classes.tableWrapper}>
            <MUTable className={classes.table} aria-labelledby="tableTitle">
              <TableHead
                headers={headers}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => {
                    const isSelected = this.isSelected(item.id);
                    return (
                      <TableRow
                        hover
                        onClick={(event) => this.handleClick(event, item.id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={item.id}
                        selected={isSelected}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={isSelected} />
                        </TableCell>
                        {editMode ? null : (
                          <Fragment>
                            <TableCell
                              component="th"
                              scope="row"
                              padding="none">
                              {getItemValue(item, firstCell)}
                            </TableCell>
                            {restHeaders.map((header) => (
                              <TableCell
                                key={`${item.id}-${header.id}`}
                                numeric={header.type.isNumeric}>
                                {getItemValue(item, header)}
                              </TableCell>
                            ))}
                          </Fragment>
                        )}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={headers.length + 1} />
                  </TableRow>
                )}
              </TableBody>
            </MUTable>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      );
    }
  }
);
