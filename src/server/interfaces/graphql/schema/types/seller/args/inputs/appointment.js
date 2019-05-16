import { inputObjectType } from 'nexus';

const AppointmentInput = inputObjectType({
  name: 'AppointmentInput',
  definition(t) {
    t.id('postId');
    t.dateTime('day');
  },
});

export default AppointmentInput;
