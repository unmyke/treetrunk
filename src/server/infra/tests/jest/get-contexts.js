import { getGlobals } from './global-utils';

const contextItem = () => getGlobals(global.context);
export default contextItem;
