import SeniorityType from '../seniority-type';
import { getQueries } from '../../generators';

const typeQueries = getQueries(SeniorityType);
const contains = [];

export default { ...typeQueries };
export { contains };
