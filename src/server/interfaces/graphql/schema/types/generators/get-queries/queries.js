import { CRUDS } from '@common';
import getQueryName from './get-query-name';

const { GET, GET_LIST } = CRUDS;

const queries = {
  GET: {
    name: GET,
    getQueryName: getQueryName(GET),
  },
};
