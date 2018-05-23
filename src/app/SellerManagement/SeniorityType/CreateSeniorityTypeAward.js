import { Operation } from '../../_lib';

export class CreateSeniorityTypeAward extends Operation {
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
      percentageMetricObject: true,
    },
  };

  async execute({ seniorityTypeIdValue, value, date }) {
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOT_FOUND,
      ALREADY_EXISTS,
      NOTHING_TO_UPDATE,
      ERROR,
    } = this.outputs;
    const {
      repositories: { SeniorityType: seniorityTypeRepo },
      commonTypes: { SeniorityTypeId, Day },
    } = this;

    try {
      this.validate(
        { seniorityTypeIdValue, award: { value, date } },
        { exception: true }
      );

      const seniorityTypeId = new SeniorityTypeId({
        value: seniorityTypeIdValue,
      });
      const seniorityType = await seniorityTypeRepo.getById(seniorityTypeId);
      const day = new Day({ value: new Date(date) });

      seniorityType.addAward(parseFloat(value), day);

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

CreateSeniorityTypeAward.setOutputs([
  'SUCCESS',
  'NOT_FOUND',
  'ALREADY_EXISTS',
  'VALIDATION_ERROR',
  'NOTHING_TO_UPDATE',
  'ERROR',
]);
