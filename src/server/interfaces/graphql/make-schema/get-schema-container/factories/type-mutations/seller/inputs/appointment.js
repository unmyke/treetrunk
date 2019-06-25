import { inputObjectType } from 'nexus';

const AppointmentInput = (ctx) => {
  const {
    scalars: { Day: DayScalar },
  } = ctx;

  return inputObjectType({
    name: 'AppointmentInput',
    definition(t) {
      t.id('postId');
      t.field('day', { type: DayScalar });
    },
  });
};

export default AppointmentInput;
