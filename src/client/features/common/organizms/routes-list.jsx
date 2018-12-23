import React, { Fragment } from 'react';
import { Route } from '../atoms';

export const RoutesList = ({ routes }) => (
  <Fragment>
    {routes.map(({ id, ...route }) => (
      <Route key={id} route={route} />
    ))}
  </Fragment>
);
