import { objectType } from 'nexus';

const Award = objectType({
  name: 'Award',
  description: 'Award for seniority',
  definition(t) {
    t.float('value');
    t.day('day');
  },
});

export default Award;
