import Chance from 'chance';
import data from './data';
import { getSubdomainsContainer } from '@infra/support/container-helpers';
export { default as createFactory } from './create-factory';

const chance = Chance();

export default getSubdomainsContainer(data, (entityData) => entityData(chance));
