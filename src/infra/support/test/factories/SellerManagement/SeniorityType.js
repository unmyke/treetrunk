export const SeniorityType = (factory, { SeniorityType }) => {
  factory.define(
    'seniorityType',
    SeniorityType,
    ({ seniority_type_id, name, months, state } = {}) => ({
      seniority_type_id:
        seniority_type_id || factory.chance('guid', { version: 4 }),
      name: name || factory.chance('word'),
      months: months || factory.chance('integer', { min: 0, max: 24 }),
      state: state || factory.chance('pickone', ['active', 'inactive']),
    }),
    {
      afterCreate: function(seniorityType, attrs, { awardCount } = {}) {
        factory.createMany('seniorityTypeAward', awardCount || 3, {
          seniority_type_id: seniorityType.seniority_type_id,
        });

        return seniorityType;
      },
    }
  );
};
