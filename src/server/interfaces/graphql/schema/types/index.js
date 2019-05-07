import { default as Seller, contains as SellerContains } from './seller';
import { default as Post, contains as PostContains } from './post';
import {
  default as SeniorityType,
  contains as SeniorityTypeContains,
} from './seniority-type';

export default { Seller, Post, SeniorityType };
export const contains = [
  ...SellerContains,
  ...PostContains,
  ...SeniorityTypeContains,
];
