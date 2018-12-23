import React from 'react';
import { Mutation } from 'react-apollo';

import { SellerForm } from '../organizms';
import { CommonContentTemplate } from '../../common/templates';

import { createSeller } from '../api';

export const CreateSellerPage = (
  <Mutation mutation={createSeller}>
    {({ createSeller }) => (
      <CommonContentTemplate>
        <SellerForm onSubmit={createSeller} />
      </CommonContentTemplate>
    )}
  </Mutation>
);
