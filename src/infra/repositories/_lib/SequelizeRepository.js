import { getAsyncOperationRunner } from '../../support/operationRunner';

import { snakeCase, lowerFirst } from 'lodash';
import { errors } from 'src/domain/errors';
import { BaseRepository } from 'src/domain/_lib';

const repoErrorMapper = {
  'Validation error': errors.modelAlreadyExists(),
  SequelizeScopeError: errors.invalidQuery(),
};

const repoOperationRunner = getAsyncOperationRunner(repoErrorMapper);

export class SequelizeRepository extends BaseRepository {
  async count() {
    return this.Model.count();
  }

  async _getById(entityId) {
    return this.Model.scope(...this.constructor.scopeIncludeModelsOptions)
      .findById(entityId.value)
      .then((model) => {
        if (model === null) {
          throw errors.modelNotFound();
        }
        return this.mapper.toEntity(model);
      });
  }

  async getAll() {
    return this._find(this.constructor.scopeWhereAllOptions);
  }

  async _find(scopeNames = []) {
    const scopes = [
      ...this.constructor.scopeIncludeModelsOptions,
      ...scopeNames,
    ];

    return repoOperationRunner(() =>
      this.Model.scope(scopes)
        .findAll()
        .then((models) => models.map((model) => this.mapper.toEntity(model)))
    );
  }

  async _add(entity) {
    return repoOperationRunner(async () => {
      const model = await this.Model.create(this.mapper.toDatabase(entity), {
        include: this.constructor.scopeIncludeModelsOptions,
      });

      return this.mapper.toEntity(model);
    });
  }

  async _delete(entityId) {
    return repoOperationRunner(() =>
      this.Model.destroy({
        where: { [this._getIdPropName(entityId)]: entityId.value },
        cascade: true,
      }).then((destroyedRowsCount) => {
        if (destroyedRowsCount === 0) {
          throw errors.modelNotFound();
        }

        return true;
      })
    );
  }

  async _update(entity) {
    const model = await this.Model.findById(this._getIdValueByEntity(entity), {
      include: this.constructor.scopeIncludeModelsOptions,
    });

    if (model === null) {
      throw errors.modelNotFound();
    }

    return repoOperationRunner(async () =>
      model
        .update(this.mapper.toDatabase(entity))
        .then((model) => this.mapper.toEntity(model))
    );
  }

  _getIdValueByEntity(entity) {
    const idPropName = lowerFirst(`${entity.constructor.name}Id`);

    return entity[idPropName].value;
  }

  _getIdPropName(entityId) {
    return snakeCase(entityId.constructor.name);
  }
}
