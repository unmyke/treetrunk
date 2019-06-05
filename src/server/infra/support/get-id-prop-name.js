import { lowerFirst } from 'lodash';

const getIdPropName = (entity) => `${lowerFirst(entity.constructor.name)}Id`;
export default getIdPropName;
