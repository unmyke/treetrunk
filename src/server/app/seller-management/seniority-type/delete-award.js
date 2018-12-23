import { Operation } from '../../_lib';

export class DeleteSeniorityTypeAward extends Operation {
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
  };

  async execute({ seniorityTypeIdValue, value, date }) {
    const { SUCCESS, VALIDATION_ERROR, NOT_FOUND, ERROR } = this.outputs;
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

      seniorityType.deleteAward(parseFloat(value), day);

      const newSeniorityType = await seniorityTypeRepo.save(seniorityType);

      this.emit(SUCCESS, newSeniorityType.toJSON());
    } catch (error) {
      switch (error.code) {
        case 'INVALID_VALUE':
          return this.emit(VALIDATION_ERROR, error);
        case 'NOT_FOUND':
          return this.emit(NOT_FOUND, error);
        default:
          this.emit(ERROR, error);
      }
    }
  }
}

DeleteSeniorityTypeAward.setOutputs([
  'SUCCESS',
  'NOT_FOUND',
  'VALIDATION_ERROR',
  'ERROR',
]);
