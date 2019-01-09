import React from 'react';
import { TableAction } from '@ui/atoms';

const desc = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export const stableSort = (array, cmp) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export const getSorting = (order, orderBy) =>
  order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);

export const getItemValue = (item, header) =>
  header.type.value(item[header.id]);

export const hasEmptyRows = ({ length = 0 }) => length === 0;
export const hasSingleRow = ({ length = 0 }) => length === 1;
export const hasManyRows = ({ length = 0 }) => length > 1;
export const hasOneOrManyRows = ({ length = 0 }) => length > 0;

export const getAction = ({ title, Icon, rowNumericatyShowPrediacate }) => ({
  rows,
  showPrediacate,
  mutation,
}) => (
  <TableAction
    rows={rows}
    title={title}
    Icon={Icon}
    rowNumericatyShowPrediacate={rowNumericatyShowPrediacate}
    showPrediacate={showPrediacate}
    mutation={mutation}
  />
);

export const getIsInStatesPredicate = (states) => {
  if (!states || states.length === 0) {
    return () => true;
  }

  return (rows) =>
    rows.reduce(
      (isInStates, { state }) => isInStates && states.includes(state),
      true
    );
};
