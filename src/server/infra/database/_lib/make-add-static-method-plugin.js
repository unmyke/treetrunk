import METHOD_TYPES from './method-types';
import makeAddMethodPlugin from './make-add-method-plugin';

const makeAddStaticMethodPlugin = makeAddMethodPlugin(METHOD_TYPES.STATIC);
export default makeAddStaticMethodPlugin;
