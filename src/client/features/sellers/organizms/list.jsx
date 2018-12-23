import React from 'react';
import { Table } from 'ui/organizms';
import { table } from '../atoms';

export const SellersList = ({ sellers }) => (
  <Table
    name={table.name}
    data={sellers}
    headers={table.headers}
    orderBy={table.defaultOrderBy}
    actions={table.actions}
  />
);
