import { lowerFirst } from 'lodash';

const getRootTypeMutationName = (typeName) => lowerFirst(typeName);
export default getRootTypeMutationName;
