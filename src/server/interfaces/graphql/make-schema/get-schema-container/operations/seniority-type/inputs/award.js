import { inputObjectType } from 'nexus';

const AwardInput = inputObjectType({
  name: 'AwardInput',
  definition(t) {
    t.positiveFloat('value');
    t.dateTime('day');
  },
});

export default AwardInput;
