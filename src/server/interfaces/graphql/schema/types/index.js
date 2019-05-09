import PageInfo from './page-info';

import Seller, {
  contains as SellerContains,
  connection as SellerConnection,
  queries as SellerQueries,
} from './seller';
import Post, {
  contains as PostContains,
  connection as PostConnection,
  queries as PostQueries,
} from './post';
import SeniorityType, {
  contains as SeniorityTypeContains,
  connection as SeniorityTypeConnection,
  queries as SeniorityTypeQueries,
} from './seniority-type';

export default { Seller, Post, SeniorityType };
export const contains = [
  PageInfo,
  ...SellerContains,
  ...PostContains,
  ...SeniorityTypeContains,
];
export const connections = [
  PostConnection,
  SeniorityTypeConnection,
  SellerConnection,
];
export const queries = [PostQueries, SellerQueries, SeniorityTypeQueries];
