import Seller, { plugins as SellerPlugins } from './seller';
import Post, { plugins as PostPlugins } from './post';
import SeniorityType, {
  plugins as SeniorityTypePlugins,
} from './seniority-type';

export default {
  Seller,
  Post,
  SeniorityType,
};

export const plugins = {
  Seller: SellerPlugins,
  Post: PostPlugins,
  SeniorityType: SeniorityTypePlugins,
};
