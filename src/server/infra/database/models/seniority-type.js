import BaseModel from './base-model';

export default class SeniorityType extends BaseModel {}

const extendSeniorityType = (SeniorityType) => {
  SeniorityType.getByMonths = function getByMonths(months) {
    return this.where('months')
      .lte(months)
      .sort('months', -1)
      .findOne();
  };

  SeniorityType.textFilterFields = function textFilterFields() {
    return ['name'];
  };

  SeniorityType.getAllBetweenMonths = function getAllBetweenMonths({
    min,
    max,
  }) {
    return this.getByMonths(min).then((minSeniorityType) => {
      if (!minSeniorityType) {
        return [];
      }

      return this.where('months')
        .gte(minSeniorityType.get('months'))
        .lte(max)
        .find();
    });
  };
};

SeniorityType.use(extendSeniorityType);
