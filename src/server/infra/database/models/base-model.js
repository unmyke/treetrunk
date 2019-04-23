import { Model } from 'mongorito';
import errorsFactory from '@domain/errors';

export default class BaseModel extends Model {
  static errors = errorsFactory;
}
