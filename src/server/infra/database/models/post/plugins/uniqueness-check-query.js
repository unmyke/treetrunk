import { makeAddStaticMethodPlugin } from '../../../_lib';

const uniquenessCheckQuery = (Model) => ({ name }) => Model.where({ name });
export default makeAddStaticMethodPlugin(uniquenessCheckQuery);
