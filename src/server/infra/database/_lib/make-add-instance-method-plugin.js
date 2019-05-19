import METHOD_TYPES from './method-types';
import makeAddMethodPlugin from './make-add-method-plugin';

const makeAddInstanceMethodPlugin = makeAddMethodPlugin(METHOD_TYPES.INSTANCE);
export default makeAddInstanceMethodPlugin;
