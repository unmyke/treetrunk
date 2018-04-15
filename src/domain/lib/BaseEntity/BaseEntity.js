import { BaseId } from '../BaseId';

export class BaseEntity {
  constructor(id = new BaseId()) {
    this.id = id;
  }
}
