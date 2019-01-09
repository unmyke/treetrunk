import React from 'react';

import { RoutesList } from '@features/common/organizms';
import { NotFoundPage } from '@features/common';
import { sellersRoutes } from '@features/sellers';
// import { shopsRoutes } from '@features/shops';
// import { workshiftsRoutes } from '@features/workshifts';
// import { dictionaryRoutes } from '@features/dictionary';

const routes = [
  ...sellersRoutes(),
  // ...shopsRoutes(),
  // ...workshiftsRoutes(),
  // ...dictionaryRoutes(),
  { id: 'NotFound', component: NotFoundPage },
];

export const rootRoutes = () => <RoutesList routes={routes} />;
