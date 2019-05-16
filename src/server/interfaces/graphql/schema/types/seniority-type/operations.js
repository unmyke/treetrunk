import args from '../../args';
import { getOperations } from '../../generators';
import SeniorityType from './seniority-type';
import typeArgs, { contains as typeContains } from './args';

const typeQueries = getOperations({
  type: SeniorityType,
  args: { ...typeArgs, ...args },
});
const contains = [...typeContains];

export default { ...typeQueries };
export { contains };
