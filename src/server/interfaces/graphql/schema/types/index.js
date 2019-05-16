// import PageInfo from './page-info';

import Seller, {
  contains as SellerContains,
  connection as SellerConnection,
  operations as SellerOperations,
} from './seller';
import Post, {
  contains as PostContains,
  connection as PostConnection,
  operations as PostOperations,
} from './post';
import SeniorityType, {
  contains as SeniorityTypeContains,
  connection as SeniorityTypeConnection,
  operations as SeniorityTypeOperations,
} from './seniority-type';

export default { Seller, Post, SeniorityType };
export const contains = [
  ...SellerContains,
  ...PostContains,
  ...SeniorityTypeContains,
];
export const connections = [
  // PageInfo,
  PostConnection,
  SeniorityTypeConnection,
  SellerConnection,
];
export const operations = [
  PostOperations,
  SellerOperations,
  SeniorityTypeOperations,
];
