export const SeniorityTypeAward = (factory, { SeniorityTypeAward }) => {
  factory.define(
    'seniorityTypeAward',
    SeniorityTypeAward,
    ({ value, day } = {}) => ({
      value: value || factory.chance('floating', { fixed: 2 }),
      day: day || factory.chance('date'),
    })
  );
};
