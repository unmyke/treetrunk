import Post from './post';
import args from '../../args';
import typeArgs, { contains as typeArgsContains } from './args';
import { getOperations } from '../../generators';

const typeOperations = getOperations({
  type: Post,
  args: { ...args, ...typeArgs },
});
const contains = [...typeArgsContains];

export default { ...typeOperations };
export { contains };
