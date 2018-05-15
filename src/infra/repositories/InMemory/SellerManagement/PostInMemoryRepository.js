import { InMemoryRepository } from '../InMemoryRepository';

export class PostInMemoryRepository extends InMemoryRepository {
  static uniqueness = {
    name: true,
  };
}
