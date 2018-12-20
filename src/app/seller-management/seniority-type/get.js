import { Operation } from '../../_lib';

export class GetSeniorityType extends Operation {
  async execute(seniorityTypeIdValue) {
    const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;
    const {
      commonTypes: { SeniorityTypeId },
      repositories: { SeniorityType: seniorityTypeRepo },
    } = this;

    try {
      const seniorityTypeId = new SeniorityTypeId({
        value: seniorityTypeIdValue,
      });
      const seniorityType = await seniorityTypeRepo.getById(seniorityTypeId);

      this.emit(SUCCESS, seniorityType.toJSON());
    } catch (error) {
      if (error.code === 'NOT_FOUND') {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetSeniorityType.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);
