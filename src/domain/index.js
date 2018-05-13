import {
  Seller,
  SellerId,
  Post,
  PostId,
  SeniorityType,
  SeniorityTypeId,
  SellerManagementService,
} from './Seller';

import { Day, DayRange } from './_lib/ValueObjects';
import { Validation, Persistence } from './_lib/ErrorFactories';

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
  DayRange,
};

export const ErrorFactories = {
  Validation,
  Persistence,
};

export const services = {
  Seller: SellerManagementService,
};
