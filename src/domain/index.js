import {
  Seller,
  SellerId,
  Post,
  PostId,
  SeniorityType,
  SeniorityTypeId,
  SellerManagementService,
} from './Seller';

export const entities = {
  Seller,
  Post,
  SeniorityType,
};

export const commonTypes = {
  SellerId,
  PostId,
  SeniorityTypeId,
};

export const services = {
  Seller: SellerManagementService,
};
