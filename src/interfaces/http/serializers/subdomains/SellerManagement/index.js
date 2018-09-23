import { merge } from 'lodash';
import { SellerManagementBaseSerializer } from './SellerManagementBaseSerializer';
import { SellerSerializer } from './SellerSerializer';
import { PostSerializer } from './PostSerializer';
import { SeniorityTypeSerializer } from './SeniorityTypeSerializer';

export const Seller = merge(SellerSerializer, SellerManagementBaseSerializer);
export const Post = merge(PostSerializer, SellerManagementBaseSerializer);
export const SeniorityType = merge(
  SeniorityTypeSerializer,
  SellerManagementBaseSerializer
);
