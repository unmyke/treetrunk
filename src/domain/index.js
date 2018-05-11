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
import { ValidationError, PersistenceError } from './_lib/Errors';

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

export const Errors = {
  ValidationError,
  PersistenceError,
};

export const services = {
  Seller: SellerManagementService,
};
