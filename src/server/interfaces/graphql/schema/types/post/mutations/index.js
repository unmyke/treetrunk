import Post from '../post';
import args, { contains as argsContains } from './args';
import { getMutations } from '../../generators';

const typeMutations = getMutations(Post, args);
const contains = [...argsContains];

export default { ...typeMutations };
export { contains };
