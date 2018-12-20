import { errors } from 'src/domain/errors';
import { SequelizeRepository } from '../../_lib';
import { getAsyncOperationRunner } from 'src/infra/support/operation-runner';

const repoErrorMessageMapper = {
  MODEL_ALREADY_EXISTS: errors.sellerAlreadyExists(),
  MODEL_NOT_FOUND: errors.sellerNotFound(),
};

const repoOperationRunner = getAsyncOperationRunner(repoErrorMessageMapper);

export class SellerSequelizeRepository extends SequelizeRepository {
  static scopeIncludeModelsOptions = ['appointments'];
  static scopeWhereAllOptions = ['get_all'];

  async find({ search, states }) {
    const query = [];

    if (search) {
      query.push({ method: ['search', search] });
    }

    if (states) {
      query.push({ method: ['states', states] });
    }

    return this._find(query);
  }

  async getById(sellerId) {
    return repoOperationRunner(() => this._getById(sellerId));
  }

  async add(seller) {
    return repoOperationRunner(() => this._add(seller));
  }
  async delete(sellerId) {
    return repoOperationRunner(() => this._delete(sellerId));
  }

  async update(seller) {
    return repoOperationRunner(() => this._update(seller));
  }

  async addAppointment(
    { value: seller_id },
    { value: post_id },
    { value: day }
  ) {
    const {
      SellerAppointment: SellerAppointmentModel,
    } = this.models.SellerManagement;

    return repoOperationRunner(() =>
      SellerAppointmentModel.create({ seller_id, post_id, day }).then(
        () => true
      )
    );
  }

  async deleteAppointmentAt({ value: seller_id }, { value: day }) {
    const {
      SellerAppointment: SellerAppointmentModel,
    } = this.models.SellerManagement;

    return repoOperationRunner(() =>
      SellerAppointmentModel.destroy({
        where: { seller_id, day },
      }).then(() => true)
    );
  }

  async updateAppointmentTo(
    { value: seller_id },
    { value: day },
    { value: new_post_id },
    { value: new_day }
  ) {
    const {
      SellerAppointment: SellerAppointmentModel,
    } = this.models.SellerManagement;

    return repoOperationRunner(() =>
      SellerAppointmentModel.update(
        { post_id: new_post_id, day: new_day },
        {
          where: { seller_id, day },
        }
      ).then(() => true)
    );
  }
}
