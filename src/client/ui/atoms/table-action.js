import React from 'react';
import { Mutation } from 'react-apollo';
import { IconButton, Tooltip } from '@material-ui/core';
import { noop } from '@lib/noop';

export const TableAction = ({
  title,
  Icon,
  mutation,
  rows,
  rowNumericatyShowPrediacate,
  showPrediacate = () => !noop(),
}) =>
  !rowNumericatyShowPrediacate(rows) && !showPrediacate(rows) ? null : (
    <Mutation mutation={mutation}>
      {(action, { data }) => (
        <Tooltip title={title}>
          <IconButton
            aria-label={title}
            rows={rows}
            onClick={action({ variables: { data } })}>
            <Icon />
          </IconButton>
        </Tooltip>
      )}
    </Mutation>
  );
