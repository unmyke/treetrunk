import { Operation } from '../../_lib';

export class UpdateSeniorityTypeAward extends Operation {
  static constraints = {
    seniorityTypeIdValue: {
      presence: {
        allowEmpty: false,
      },
      format: {
        pattern: '[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}',
        message: '^SeniorityTypeId: "%{value}" must be UUID',
      },
    },
    award: {
      integerMetricObject: true,
    },
    updatedAward: {
      integerMetricObject: true,
    },
  };

  async execute({ seniorityTypeIdValue, award, updatedAward }) {
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOT_FOUND,
      NOTHING_TO_UPDATE,
      ERROR,
    } = this.outputs;
    const {
      repositories: { SeniorityType: seniorityTypeRepo },
      commonTypes: { SeniorityTypeId, Day },
    } = this;

    try {
      this.validate(
        { seniorityTypeIdValue, award, updatedAward },
        { exception: true }
      );

      const seniorityTypeId = new SeniorityTypeId({
        value: seniorityTypeIdValue,
      });
      const seniorityType = await seniorityTypeRepo.getById(seniorityTypeId);

      const day = new Day({ value: new Date(award.date) });
      const updatedDay = new Day({ value: new Date(updatedAward.date) });

      seniorityType.editAward(
        parseFloat(award.value),
        day,
        parseFloat(updatedAward.value),
        updatedDay
      );

      const newSeniorityType = await seniorityTypeRepo.save(seniorityType);

      this.emit(SUCCESS, newSeniorityType.toJSON());
    } catch (error) {
      switch (error.code) {
        case 'INVALID_VALUE':
          return this.emit(VALIDATION_ERROR, error);
        case 'NOT_FOUND':
          return this.emit(NOT_FOUND, error);
        case 'ALREADY_EXISTS':
          return this.emit(ALREADY_EXISTS, error);
        case 'NOTHING_TO_UPDATE':
          return this.emit(NOTHING_TO_UPDATE, error);
        default:
          this.emit(ERROR, error);
      }
    }
  }
}

UpdateSeniorityTypeAward.setOutputs([
  'SUCCESS',
  'NOT_FOUND',
  'VALIDATION_ERROR',
  'NOTHING_TO_UPDATE',
  'ERROR',
]);
