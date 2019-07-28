import * as CRUDS from './cruds';
import isListGetter from './is-list-getter';
import isMultipleSetter from './is-multiple-setter';
import isSetter from './is-setter';
import isGetter from './is-getter';

export default CRUDS;
export const crudPredicates = {
  isListGetter,
  isMultipleSetter,
  isSetter,
  isGetter,
};
