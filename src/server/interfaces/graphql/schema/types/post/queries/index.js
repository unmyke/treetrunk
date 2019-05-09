import Post from '../post';
import { getQueries } from '../../generators';

const typeQueries = getQueries(Post);
const contains = [];

export default { ...typeQueries };
export { contains };
