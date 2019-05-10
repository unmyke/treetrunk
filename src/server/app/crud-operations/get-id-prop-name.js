import { lowerFirst } from 'lodash/fp';

export default (name) => `${lowerFirst(name)}Id`;
