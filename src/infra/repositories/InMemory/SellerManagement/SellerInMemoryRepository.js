import { InMemoryRepository } from '../InMemoryRepository';

export class SellerInMemoryRepository extends InMemoryRepository {
  static uniqueness = {
    lastName: {
      with: ['firstName', 'middleName', 'phone'],
    },
  };

  countByPostId(postId) {
    return this.count({ where: { postId } });
  }
}
