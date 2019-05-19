import { makeAddStaticMethodPlugin } from '../../../_lib';

const uniquenessCheckQuery = (Model) => ({ name, months }) =>
  Model.or([{ name }, { months }]);
export default makeAddStaticMethodPlugin(uniquenessCheckQuery);
