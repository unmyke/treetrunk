import Seller from '../seller';
import { getQueries } from '../../generators';

const typeQueries = getQueries(Seller);
const contains = [];

export default { ...typeQueries };
export { contains };
