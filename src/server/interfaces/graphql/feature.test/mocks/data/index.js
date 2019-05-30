import Chance from 'chance';
import * as SellerManagement from './seller-management';
import { getSubdomainsContainer } from '@infra/support/container-helpers';

const chance = Chance();

const entitiesData = { SellerManagement };

export default getSubdomainsContainer(entitiesData, (entityData) =>
  entityData(chance)
);
