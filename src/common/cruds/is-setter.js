import isGetter from './is-getter';

const isSetter = (crudName) => !isGetter(crudName);
export default isSetter;
