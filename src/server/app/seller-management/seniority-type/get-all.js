import Operation from '../../operation';

export default class GetAllSeniorityTypes extends Operation {
  async execute(props = {}) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: { SeniorityType: seniorityTypeRepo },
    } = this;

    try {
      const seniorityTypes = await seniorityTypeRepo.getAll(props);
      this.emit(
        SUCCESS,
        seniorityTypes.map((seniorityType) => seniorityType.toJSON())
      );
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetAllSeniorityTypes.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
