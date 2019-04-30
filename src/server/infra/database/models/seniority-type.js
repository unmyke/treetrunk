import BaseModel from './base-model';

export default class SeniorityType extends BaseModel {}

const extendSeniorityType = (SeniorityType) => {
  SeniorityType.getByMonths = function getByMonths(months) {
    return this.lte(months)
      .sort({ months: -1 })
      .findOne();
  };
};

SeniorityType.use(extendSeniorityType);
