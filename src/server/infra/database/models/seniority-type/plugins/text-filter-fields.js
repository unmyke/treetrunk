import { makeAddStaticMethodPlugin } from '../../../_lib';

const textFilterFields = () => () => ['name'];
export default makeAddStaticMethodPlugin(textFilterFields);
