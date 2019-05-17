import Seller, {
  contains as SellerContains,
  connection as SellerConnection,
  args as SellerArgs,
  operations as SellerOperations,
} from './seller';
import Post, {
  contains as PostContains,
  connection as PostConnection,
  args as PostArgs,
  operations as PostOperations,
} from './post';
import SeniorityType, {
  contains as SeniorityTypeContains,
  connection as SeniorityTypeConnection,
  args as SeniorityTypeArgs,
  operations as SeniorityTypeOperations,
} from './seniority-type';

export default { Seller, Post, SeniorityType };
export const contains = [
  ...SellerContains,
  ...PostContains,
  ...SeniorityTypeContains,
];
export const connections = {
  Post: PostConnection,
  SeniorityType: SeniorityTypeConnection,
  Seller: SellerConnection,
};
export const operations = {
  Post: PostOperations,
  Seller: SellerOperations,
  SeniorityType: SeniorityTypeOperations,
};
export const args = {
  Seller: SellerArgs,
  Post: PostArgs,
  SeniorityType: SeniorityTypeArgs,
};
