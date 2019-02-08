import { getRandomDay } from '../_lib';

const SeniorityTypeAward = (factory, { SeniorityTypeAward }) => {
  factory.define('seniorityTypeAward', SeniorityTypeAward, {
    value: factory.chance('floating', { fixed: 2 }),
    day: () => getRandomDay(),
  });
};

export default SeniorityTypeAward;
