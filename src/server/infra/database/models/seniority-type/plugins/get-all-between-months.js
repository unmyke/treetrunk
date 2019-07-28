import { makeAddStaticMethodPlugin } from '../../../_lib';

const getAllBetweenMonths = (Model) => ({ min, max }) =>
  Model.getByMonths(min).then((minSeniorityType) => {
    if (!minSeniorityType) {
      return [];
    }

    return Model.where('months')
      .gte(minSeniorityType.get('months'))
      .lte(max)
      .find();
  });

export default makeAddStaticMethodPlugin(getAllBetweenMonths);
