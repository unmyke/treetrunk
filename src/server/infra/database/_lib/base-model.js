import { Model } from 'mongorito';
import { errors } from '@domain';

class BaseModel extends Model {
  static errors = errors;
}

export default BaseModel;
