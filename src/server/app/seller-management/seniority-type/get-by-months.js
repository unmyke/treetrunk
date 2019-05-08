import Operation from '../../operation';

export default class GetSeniorityTypeByMonths extends Operation {
  async execute(months) {
    const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;
    const {
      repositories: { SeniorityType: seniorityTypeRepo },
    } = this;

    try {
      const seniorityType = await seniorityTypeRepo.getByMonths(months);

      this.emit(SUCCESS, seniorityType);
    } catch (error) {
      if (error.code === 'NOT_FOUND') {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetSeniorityTypeByMonths.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);
