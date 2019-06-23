import { lowerFirst } from 'lodash';

const getTypeQueryName = ({ name }) => lowerFirst(name);
export default getTypeQueryName;
