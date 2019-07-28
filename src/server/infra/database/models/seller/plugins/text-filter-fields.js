import { makeAddStaticMethodPlugin } from '../../../_lib';

const textFilterFields = () => () => [
  'firstName',
  'middleName',
  'lastName',
  'phone',
];
export default makeAddStaticMethodPlugin(textFilterFields);
