import Operation from '../../operation';

export default class UpdateSeniorityType extends Operation {
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
    name: {
      presence: {
        allowEmpty: false,
      },
    },
    months: {
      presence: {
        allowEmpty: false,
      },
      numericality: {
        onlyInteger: true,
        greaterThan: 0,
      },
    },
  };

  async execute({ seniorityTypeIdValue, name, months }) {
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
      commonTypes: { SeniorityTypeId },
      validate,
    } = this;

    try {
      validate({ seniorityTypeIdValue, name, months }, { exception: true });

      const seniorityTypeId = new SeniorityTypeId({
        value: seniorityTypeIdValue,
      });
      const seniorityType = await seniorityTypeRepo.getById(seniorityTypeId);

      seniorityType.update({ name, months: parseInt(months) });

      const updatedSeniorityType = await seniorityTypeRepo.save(seniorityType);

      this.emit(SUCCESS, updatedSeniorityType.toJSON());
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

UpdateSeniorityType.setOutputs([
  'SUCCESS',
  'VALIDATION_ERROR',
  'NOT_FOUND',
  'ALREADY_EXISTS',
  'NOTHING_TO_UPDATE',
  'ERROR',
]);
