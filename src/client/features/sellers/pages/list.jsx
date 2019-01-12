import React from 'react';
import { Query } from 'react-apollo';

import { SellersList } from '../organizms';
import { CommonContentTemplate } from '../../common/templates';

import { getSellers } from '../api';

export const SellersListPage = (
  <Query
    query={getSellers}
    render={({ sellers }) => (
      <CommonContentTemplate>
        <SellersList sellers={sellers} />
      </CommonContentTemplate>
    )}
  />
);
