import { makeAddStaticMethodPlugin } from '../../../_lib';

const getByMonths = (Model) => (months) =>
  Model.where('months')
    .lte(months)
    .sort('months', -1)
    .findOne();

export default makeAddStaticMethodPlugin(getByMonths);
