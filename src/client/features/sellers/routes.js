import React from 'react';
import { CreateSellerPage, UpdateSellerPage, SellersListPage } from './pages';
import paths from 'constants/paths';

const baseUri = paths.sellers.path;

export const sellersRoutes = () => [
  {
    id: 'sellersList',
    path: `${baseUri}/`,
    exact: true,
    componet: SellersListPage,
  },
  {
    id: 'sellerCreate',
    path: `${baseUri}/new`,
    exact: true,
    render: CreateSellerPage,
  },
  {
    id: 'sellerUpdate',
    path: `${baseUri}/:id`,
    exact: true,
    render: ({ match: { params: id } }) => <UpdateSellerPage id={id} />,
  },
];
