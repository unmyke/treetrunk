import { lowerFirst } from 'lodash';

const getIdPropName = (id) => lowerFirst(id.constructor.name);

export default getIdPropName;
