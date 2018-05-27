import { InMemoryRepository } from '../InMemoryRepository';

export class PostInMemoryRepository extends InMemoryRepository {
  static uniqueness = {
    name: true,
  };

  static defaultWhereProps = {
    where: {
      state: 'active',
    },
  };

  static queryParams = {
    active: (value) => ({ state: value === 'true' ? 'active' : 'inactive' }),
    hasPieceRates: (value) => ({
      hasPieceRates: value === 'true' ? true : false,
    }),
  };

  getAllPosts(query) {
    return this.getAll(this._getWhereParams(query));
  }
}
