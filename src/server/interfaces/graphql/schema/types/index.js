// import PageInfo from './page-info';

import Seller, {
  contains as SellerContains,
  connection as SellerConnection,
  queries as SellerQueries,
  mutations as SellerMutations,
} from './seller';
import Post, {
  contains as PostContains,
  connection as PostConnection,
  queries as PostQueries,
  mutations as PostMutations,
} from './post';
import SeniorityType, {
  contains as SeniorityTypeContains,
  connection as SeniorityTypeConnection,
  queries as SeniorityTypeQueries,
  mutations as SeniorityTypeMutations,
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
export const queries = [PostQueries, SellerQueries, SeniorityTypeQueries];
export const mutations = [
  PostMutations,
  SellerMutations,
  SeniorityTypeMutations,
];
