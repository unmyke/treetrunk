import React from 'react';
import { Route as RRDRoute } from 'react-router-dom';

export const Route = ({ route: { path, exact, ...params } }) => (
  <RRDRoute path={path} exact={exact} {...params} />
);
