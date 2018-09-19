import { toDTO } from 'src/interfaces/http/serializers/_lib';

export class BaseSerializer {
  serialize(entity) {
    return toDTO(entity, this.constructor.mapper);
  }
}
