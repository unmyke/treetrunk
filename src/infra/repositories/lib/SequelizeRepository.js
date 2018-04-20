import { BaseRepository } from './BaseRepository';

export class Sequelize extends BaseRepository {
  constructor({ domain, models }) {
    super({ domain });
    this.models = models;
  }
}
