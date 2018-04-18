import { BaseRepository } from './BaseRepository';

export class Sequelize extends BaseRepository {
  constructor({ entities, models }) {
    super({ entities });
    this.models = models;
  }
}
