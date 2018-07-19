import { setRuleSetItemsType } from '../_lib';

import { diaryMustBeNotClosedRule as diaryMustBeNotClosed } from './diaryMustBeNotClosedRule';
import { recordMustExistsRule as recordMustExists } from './recordMustExistsRule';
import { recordMustNotDuplicateRule as recordMustNotDuplicate } from './recordMustNotDuplicateRule';
import { recordMustNotExistsRule as recordMustNotExists } from './recordMustNotExistsRule';
import { recordMustNotHasEqualNeightborsRule as recordMustNotHasEqualNeightbors } from './recordMustNotHasEqualNeightborsRule';

const rules = setRuleSetItemsType(
  {
    diaryMustBeNotClosed,
    recordMustExists,
    recordMustNotDuplicate,
    recordMustNotExists,
    recordMustNotHasEqualNeightbors,
  },
  'rule'
);
export { rules };
