import { InMemoryRepository } from '../InMemoryRepository';

export class SeniorityTypeInMemoryRepository extends InMemoryRepository {
  static uniqueness = {
    name: true,
  };
}
