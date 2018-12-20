import { errors } from 'src/domain/errors';
import { SequelizeRepository } from '../../_lib';
import { getAsyncOperationRunner } from 'src/infra/support/operation-runner';

const repoErrorMessageMapper = {
  MODEL_ALREADY_EXISTS: errors.seniorityTypeAlreadyExists(),
  MODEL_NOT_FOUND: errors.seniorityTypeNotFound(),
};

const repoOperationRunner = getAsyncOperationRunner(repoErrorMessageMapper);

export class SeniorityTypeSequelizeRepository extends SequelizeRepository {
  static scopeIncludeModelsOptions = ['awards'];
  static scopeWhereAllOptions = ['get_all'];

  find({ monthsBetween, states }) {
    const query = [];

    if (monthsBetween) {
      query.push({ method: ['monthsBetween', monthsBetween] });
    }

    if (states) {
      query.push({ method: ['states', states] });
    }

    return this._find(query);
  }

  async getById(seniorityTypeId) {
    return repoOperationRunner(() => this._getById(seniorityTypeId));
  }

  async add(seniorityType) {
    return repoOperationRunner(() => this._add(seniorityType));
  }
  async delete(seniorityTypeId) {
    return repoOperationRunner(() => this._delete(seniorityTypeId));
  }

  async update(seniorityType) {
    return repoOperationRunner(() => this._update(seniorityType));
  }

  async addAward({ value: seniority_type_id }, value, { value: day }) {
    const {
      SeniorityTypeAward: SeniorityTypeAwardModel,
    } = this.models.SellerManagement;

    return repoOperationRunner(() =>
      SeniorityTypeAwardModel.create({ seniority_type_id, value, day }).then(
        () => true
      )
    );
  }

  async deleteAwardAt({ value: seniority_type_id }, { value: day }) {
    const {
      SeniorityTypeAward: SeniorityTypeAwardModel,
    } = this.models.SellerManagement;

    return repoOperationRunner(() =>
      SeniorityTypeAwardModel.destroy({
        where: { seniority_type_id, day },
      }).then(() => true)
    );
  }

  async updateAwardTo(
    { value: seniority_type_id },
    { value: day },
    new_value,
    { value: new_day }
  ) {
    const {
      SeniorityTypeAward: SeniorityTypeAwardModel,
    } = this.models.SellerManagement;

    return repoOperationRunner(() =>
      SeniorityTypeAwardModel.update(
        { value: new_value, day: new_day },
        {
          where: { seniority_type_id, day },
        }
      ).then(() => true)
    );
  }
}
