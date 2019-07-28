import { lowerFirst } from 'lodash/fp';

const getIdPropName = (Model) => `${lowerFirst(Model.name)}Id`;
export default getIdPropName;
