import { objectType } from 'nexus';

import { Day } from '../../scalars';

const Award = objectType({
  name: 'Award',
  description: 'Award for seniority',
  definition(t) {
    t.float('value');
    t.field('day', Day);
  },
});

export default Award;
