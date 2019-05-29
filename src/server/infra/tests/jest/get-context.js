import { getGlobal } from './global-utils';

const contextItem = () => getGlobal(global.context);
export default contextItem;
