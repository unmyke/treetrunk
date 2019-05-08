import getTypesResolvers from './_lib/get-types-resolvers';

export { default as getPost } from './get-post';
export { default as getPostsByPostIds } from './get-posts-by-post-ids';
export { default as getPosts } from './get-posts';
export { default as getSeller } from './get-seller';
export { default as getSeniorityType } from './get-seniority-type';
export {
  default as getSeniorityTypeByMonths,
} from './get-seniority-type-by-months';

export default getTypesResolvers(['Seller', 'Post', 'SeniorityType']);
