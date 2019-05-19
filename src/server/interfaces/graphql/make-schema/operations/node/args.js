import { arg } from 'nexus';

import { Cursor as CursorScalar } from '../../scalars';

const nodeArgs = {
  cursor: arg({ type: CursorScalar, required: true }),
};

export default nodeArgs;
