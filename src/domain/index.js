import {
  Seller,
  SellerId,
  Post,
  PostId,
  SeniorityType,
  SeniorityTypeId,
  SellerManagementService,
} from './Seller';

import { Day } from './_lib/ValueObjects';

export const entities = {
  Seller,
  Post,
  SeniorityType,
};

export const commonTypes = {
  SellerId,
  PostId,
  SeniorityTypeId,
  Day,
};

export const services = {
  Seller: SellerManagementService,
};
