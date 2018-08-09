import { InMemoryRepository } from '../InMemoryRepository';

export class SellerInMemoryRepository extends InMemoryRepository {
  static uniqueness = {
    lastName: {
      with: ['firstName', 'middleName', 'phone'],
    },
  };

  static defaultWhereProps = {
    state: 'active',
  };

  static queryParams = {
    active: (value) => ({ state: value === 'true' ? 'active' : 'inactive' }),
  };

  async countByPostId(postId) {
    return await this.count({ where: { postId } });
  }
}
