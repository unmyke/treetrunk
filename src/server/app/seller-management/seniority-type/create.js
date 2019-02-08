import Operation from '../../operation';

export default class CreateSeniorityType extends Operation {
  static constraints = {
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

  async execute({ name, months }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR, ALREADY_EXISTS } = this.outputs;
    const {
      repositories: { SeniorityType: seniorityTypeRepo },
      entities: { SeniorityType },
      validate,
    } = this;

    try {
      validate({ name, months }, { exception: true });

      const seniorityType = new SeniorityType({
        name,
        months: parseInt(months),
      });

      const newSeniorityType = await seniorityTypeRepo.add(seniorityType);

      this.emit(SUCCESS, newSeniorityType.toJSON());
    } catch (error) {
      switch (error.code) {
        case 'ALREADY_EXISTS':
          this.emit(ALREADY_EXISTS, error);
          break;
        case 'INVALID_VALUE':
          this.emit(VALIDATION_ERROR, error);
          break;
        default:
          this.emit(ERROR, error);
          break;
      }
    }
  }
}

CreateSeniorityType.setOutputs([
  'SUCCESS',
  'ERROR',
  'VALIDATION_ERROR',
  'ALREADY_EXISTS',
]);
