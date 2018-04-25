import { BaseRepository } from './BaseRepository';

export class SequelizeRepository extends BaseRepository {
  constructor({ domain, models }) {
    super({ domain });
    this.models = models;
  }
}
