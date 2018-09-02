export const SeniorityType = (factory, { SeniorityType }) => {
  factory.define(
    'seniorityType',
    SeniorityType,
    {
      seniority_type_id: factory.chance('guid', { version: 4 }),
      name: factory.chance('word'),
      months: factory.chance('integer', { min: 1, max: 65535 }),
      state: factory.chance('pickone', ['active', 'deleted']),
    },
    {
      afterCreate: async function(seniorityType, attrs, { awardsCount } = {}) {
        if (awardsCount === 0 && attrs.awards && attrs.awards.length === 0) {
          return seniorityType.reload({ include: ['awards'] });
        }

        const awardAttrs = {
          seniority_type_id: seniorityType.seniority_type_id,
        };

        const awardFactoryArgs = ['seniorityTypeAward'];

        switch (true) {
          case awardsCount !== undefined && awardsCount > 0:
            awardFactoryArgs.push(awardsCount, awardAttrs);
            break;

          case attrs.awards !== undefined && attrs.awards.length > 0:
            awardFactoryArgs.push(
              attrs.awards.map((attr) => ({
                ...attr,
                ...awardAttrs,
              }))
            );
            break;

          default:
            awardFactoryArgs.push(3, awardAttrs);
            break;
        }

        return factory
          .createMany(...awardFactoryArgs)
          .then(() => seniorityType.reload({ include: ['awards'] }));
      },
    }
  );
};
