import { InMemoryRepository } from '../InMemoryRepository';

export class PostInMemoryRepository extends InMemoryRepository {
  static uniqueness = {
    name: true,
  };

  static defaultWhereProps = {
    state: 'active',
  };

  static queryParams = {
    active: (value) => ({ state: value === 'true' ? 'active' : 'inactive' }),
    hasPieceRates: (value) => ({
      hasPieceRates: value === 'true' ? true : false,
    }),
  };
}
