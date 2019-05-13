import { Model } from 'mongorito';
import { errors } from '@domain';

export default class BaseModel extends Model {
  static errors = errors;
}
