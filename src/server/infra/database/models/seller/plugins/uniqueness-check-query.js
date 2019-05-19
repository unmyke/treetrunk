import { makeAddStaticMethodPlugin } from '../../../_lib';

const uniquenessCheckQuery = (Model) => ({
  firstName,
  middleName,
  lastName,
  phone,
}) =>
  Model.where({
    firstName,
    middleName,
    lastName,
    phone,
  });
export default makeAddStaticMethodPlugin(uniquenessCheckQuery);
