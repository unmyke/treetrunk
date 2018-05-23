import { Operation } from '../../_lib';

export class DeleteSeniorityType extends Operation {
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
  };

  async execute({ seniorityTypeIdValue }) {
    const { SUCCESS, NOT_FOUND, NOT_ALLOWED, ERROR } = this.outputs;

    const {
      repositories: { SeniorityType: seniorityTypeRepo, Seller: sellerRepo },
      commonTypes: { SeniorityTypeId },
      domainServices: { SellerService },
      validate,
    } = this;

    try {
      validate({ seniorityTypeIdValue }, { exception: true });

      const seniorityTypeId = new SeniorityTypeId({
        value: seniorityTypeIdValue,
      });

      const sellersCountWithSeniorityTypeId = await sellerRepo.countBySeniorityTypeId(
        seniorityTypeId
      );

      if (sellersCountWithSeniorityTypeId > 0) {
        const seniorityType = await seniorityTypeRepo.getById(seniorityTypeId);

        throw this.errorFactory.createNotAllowed(
          seniorityType,
          `There are sellers appointed to seniorityType "${seniorityType.name}"`
        );
      }

      await seniorityTypeRepo.remove(seniorityTypeId);

      this.emit(SUCCESS);
    } catch (error) {
      switch (error.code) {
        case 'NOT_FOUND':
          return this.emit(NOT_FOUND, error);
        case 'NOT_ALLOWED':
          return this.emit(NOT_ALLOWED, error);
        default:
          this.emit(ERROR, error);
      }
    }
  }
}

DeleteSeniorityType.setOutputs([
  'SUCCESS',
  'NOT_FOUND',
  'NOT_ALLOWED',
  'ERROR',
]);
