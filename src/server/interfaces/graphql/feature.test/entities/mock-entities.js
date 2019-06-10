import Chance from 'chance';
import { getSubdomainsContainer } from '@infra/support/container-helpers';
import * as SellerManagement from './seller-management';

const chance = Chance();
const dataFactory = { SellerManagement };

const mockEntities = getSubdomainsContainer(dataFactory, (entityFactory) =>
  entityFactory(chance)
);
export default mockEntities;
