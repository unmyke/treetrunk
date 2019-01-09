import React from 'react';
import { Mutation } from 'react-apollo';

import { SellerForm } from '../organizms';
import { CommonContentTemplate } from '../../common/templates';

import { updateSeller } from '../api';

export const UpdateSellerPage = ({ id }) => (
  <Mutation mutation={updateSeller}>
    {({ updateSeller }) => (
      <CommonContentTemplate>
        <SellerForm onSubmit={() => updateSeller(id)} />
      </CommonContentTemplate>
    )}
  </Mutation>
);
