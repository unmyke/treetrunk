import { BaseOperationValidator } from './BaseOperationValidator';
import {
  diaryClosed,
  recordAlreadyExists,
  recordDuplicate,
} from './Validators';

export class AddOperationValidator extends BaseOperationValidator {
  validate({ record }, options = {}) {
    diaryClosed.call(this, record.day, options);
    recordAlreadyExists.call(this, record.day, options);
    recordDuplicate(this, record, options);
  }
}
