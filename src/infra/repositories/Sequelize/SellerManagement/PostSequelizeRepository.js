import { errors } from 'src/domain/errors';
import { SequelizeRepository } from '../../_lib';
import { getAsyncOperationRunner } from 'src/infra/support/operationRunner';

const repoErrorMessageMapper = {
  MODEL_ALREADY_EXISTS: errors.postAlreadyExists(),
  MODEL_NOT_FOUND: errors.postNotFound(),
};

const repoOperationRunner = getAsyncOperationRunner(repoErrorMessageMapper);

export class PostSequelizeRepository extends SequelizeRepository {
  static scopeIncludeModelsOptions = ['piece_rates'];
  static scopeWhereAllOptions = ['get_all'];

  async getById(postId) {
    return repoOperationRunner(() => this._getById(postId));
  }

  async add(post) {
    return repoOperationRunner(() => this._add(post));
  }
  async delete(postId) {
    return repoOperationRunner(() => this._delete(postId));
  }

  async update(post) {
    return repoOperationRunner(() => this._update(post));
  }

  async addPieceRate({ value: post_id }, value, { value: day }) {
    const { PostPieceRate: PostPieceRateModel } = this.models.SellerManagement;

    return repoOperationRunner(() =>
      PostPieceRateModel.create({ post_id, value, day }).then(() => true)
    );
  }

  async deletePieceRateAt({ value: post_id }, { value: day }) {
    const { PostPieceRate: PostPieceRateModel } = this.models.SellerManagement;

    return repoOperationRunner(() =>
      PostPieceRateModel.destroy({
        where: { post_id, day },
      }).then(() => true)
    );
  }

  async updatePieceRateTo(
    { value: post_id },
    { value: day },
    new_value,
    { value: new_day }
  ) {
    const { PostPieceRate: PostPieceRateModel } = this.models.SellerManagement;

    return repoOperationRunner(() =>
      PostPieceRateModel.update(
        { value: new_value, day: new_day },
        {
          where: { post_id, day },
        }
      ).then(() => true)
    );
  }
}
