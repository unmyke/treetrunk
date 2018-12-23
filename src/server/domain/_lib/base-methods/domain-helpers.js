import { lowerFirst } from 'lodash';

export const getIdPropName = (id) => lowerFirst(id.constructor.name);
