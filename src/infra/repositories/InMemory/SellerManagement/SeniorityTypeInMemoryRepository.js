import { InMemoryRepository } from '../InMemoryRepository';

export class SeniorityTypeInMemoryRepository extends InMemoryRepository {
  static uniqueness = {
    name: true,
    months: true,
  };

  static defaultWhereProps = {
    state: 'active',
  };

  static queryParams = {
    active: (value) => ({ state: value === 'true' ? 'active' : 'inactive' }),
  };
}
