// import { lowerFirst } from 'lodash';

import { BaseRepository } from '../../../domain/_lib';

export class SequelizeRepository extends BaseRepository {
  async getById(entityId) {
    const model = await this.Model.findById(entityId.value);

    return this.mapper.toEntity(model);
  }

  async getAll(where = {}) {
    const models = await this.Model.findAll({ where });

    return models.map((model) => this.mapper.toEntity(model));
  }

  async add(entity) {
    const model = await this.Model.create(this.mapper.toDatabase(entity));

    return this.mapper.toEntity(model);
  }

  async delete(entityId) {
    const model = await this.Model.destroy({
      where: { id: entityId.value, cascade: true },
    });

    return this.mapper.toEntity(model);
  }

  async update(entity) {
    const model = await this.Model.findById({
      where: { id: entity[getEntityIdPropName(entity)].value, cascade: true },
    });

    const updatedModel = model.update(this.mapper.toDatabase(entity));

    return this.mapper.toEntity(updatedModel);
  }
}
