import { getDaysSequence } from '../_lib/day-utils';

const SeniorityType = (factory, { SeniorityType }) => {
  factory.define('seniorityType', SeniorityType, ({ awardsCount = 1 }) => {
    return {
      seniorityTypeId: factory.chance('guid', { version: 4 }),
      name: factory.chance('word'),
      months: factory.chance('integer', { min: 1, max: 12 * 5 }),
      state: factory.chance('pickone', ['active', 'deleted']),
      awards: () =>
        getDaysSequence({ count: awardsCount }).map((day) => ({
          value: factory.chance('floating', { fixed: 2, min: 0 })(),
          day,
        })),
    };
  });
};

export default SeniorityType;
