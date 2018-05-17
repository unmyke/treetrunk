import { InMemoryRepository } from '../InMemoryRepository';

export class SellerInMemoryRepository extends InMemoryRepository {
  static uniqueness = {
    lastName: {
      with: ['firstName', 'middleName', 'phone'],
    },
  };

  async countByPostId(postId) {
    return await this.count({ where: { postId } });
  }
}
