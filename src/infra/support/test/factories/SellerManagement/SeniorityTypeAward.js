import { getRandomDay } from '../_lib';

export const SeniorityTypeAward = (factory, { SeniorityTypeAward }) => {
  factory.define('seniorityTypeAward', SeniorityTypeAward, {
    value: factory.chance('floating', { fixed: 2 }),
    day: () => getRandomDay(),
  });
};
