import { lowerCase, upperFirst } from 'lodash';

const makeError = (message) => (detail) => {
  const err = new Error(message);
  err.title = upperFirst(lowerCase(message));
  err.code = message;
  err.detail = detail;

  return err;
};

const errors = {
  // Diary
  recordAlreadyExists: makeError('RECORD_ALREADY_EXISTS'),
  recordDuplicate: makeError('RECORD_DUPLICATE'),
  recordNotFound: makeError('RECORD_NOT_FOUND'),
  recordHasEqualNeighbours: makeError('RECORD_HAS_EQUAL_NEIGHBOURS'),
  recordHasLimitedScope: makeError('RECORD_HAS_LIMITED_SCOPE'),
  newRecordAlreadyExists: makeError('NEW_RECORD_ALREADY_EXISTS'),
  newRecordDuplicate: makeError('NEW_RECORD_DUPLICATE'),
  diaryClosed: makeError('DIARY_CLOSED'),
  diaryNotStarted: makeError('DIARY_NOT_STARTED'),
  diaryHasRecordsLater: makeError('DIARY_HAS_RECORDS_LATER'),
  diaryNotClosed: makeError('DIARY_NOT_CLOSED'),

  // Seller
  appointmentAlreadyExists: makeError('APPOINTMENT_ALREADY_EXISTS'),
  appointmentDuplicate: makeError('APPOINTMENT_DUPLICATE'),
  appointmentNotFound: makeError('APPOINTMENT_NOT_FOUND'),
  appointmentHasEqualNeighbours: makeError('APPOINTMENT_HAS_EQUAL_NEIGHBOURS'),
  appointmentHasLimitedScope: makeError('APPOINTMENT_HAS_LIMITED_SCOPE'),
  newAppointmentAlreadyExists: makeError('NEW_APPOINTMENT_ALREADY_EXISTS'),
  newAppointmentDuplicate: makeError('NEW_APPOINTMENT_DUPLICATE'),
  carrerClosed: makeError('CARRER_CLOSED'),
  sellerNotRecruited: makeError('SELLER_NOT_RECRUITED'),
  sellerHasAppointmentsLater: makeError('SELLER_HAS_APPOINTMENTS_LATER'),
  sellerNotDismissed: makeError('SELLER_NOT_DISMISSED'),
  sellerDeleted: makeError('SELLER_DELETED'),
  sellerNotDeleted: makeError('SELLER_NOT_DELETED'),
  sellerNotFound: makeError('SELLER_NOT_FOUND'),
  sellerAlreadyExists: makeError('SELLER_ALREADY_EXISTS'),

  // Post
  pieceRateAlreadyExists: makeError('PIECE_RATE_ALREADY_EXISTS'),
  pieceRateDuplicate: makeError('PIECE_RATE_DUPLICATE'),
  pieceRateNotFound: makeError('PIECE_RATE_NOT_FOUND'),
  pieceRateHasEqualNeighbours: makeError('PIECE_RATE_HAS_EQUAL_NEIGHBOURS'),
  pieceRateHasLimitedScope: makeError('PIECE_RATE_HAS_LIMITED_SCOPE'),
  newPieceRateAlreadyExists: makeError('NEW_PIECE_RATE_ALREADY_EXISTS'),
  newPieceRateDuplicate: makeError('NEW_PIECE_RATE_DUPLICATE'),
  postNotFound: makeError('POST_NOT_FOUND'),
  postActive: makeError('POST_ACTIVE'),
  postDeleted: makeError('POST_DELETED'),
  postAlreadyExists: makeError('POST_ALREADY_EXISTS'),

  // SeniorityType
  awardAlreadyExists: makeError('AWARD_ALREADY_EXISTS'),
  awardDuplicate: makeError('AWARD_DUPLICATE'),
  awardNotFound: makeError('AWARD_NOT_FOUND'),
  awardHasEqualNeighbours: makeError('AWARD_HAS_EQUAL_NEIGHBOURS'),
  awardHasLimitedScope: makeError('AWARD_HAS_LIMITED_SCOPE'),
  newAwardAlreadyExists: makeError('NEW_AWARD_ALREADY_EXISTS'),
  newAwardDuplicate: makeError('NEW_AWARD_DUPLICATE'),
  seniorityTypeNotFound: makeError('SENIORITY_TYPE_NOT_FOUND'),
  seniorityTypeActive: makeError('SENIORITY_TYPE_ACTIVE'),
  seniorityTypeDeleted: makeError('SENIORITY_TYPE_DELETED'),
  seniorityTypeAlreadyExists: makeError('SENIORITY_TYPE_ALREADY_EXISTS'),

  // FSM
  transitionNotAllowed: makeError('TRANSITION_NOT_ALLOWED'),

  // factory
  inconsistentState: makeError('INCONSISTENT_STATE'),

  // app
  appInitializeFailure: makeError('APP_INITIALIZE_FAILURE'),

  // repository
  modelNotFound: makeError('MODEL_NOT_FOUND'),
  modelAlreadyExists: makeError('MODEL_ALREADY_EXISTS'),
  invalidQuery: makeError('INVALID_QUERY'),
  databaseError: makeError('DATABASE_ERROR'),

  // GraphQL
  gqlInvalidInput: makeError('GQL_INVALID_INPUT'),

  // serializer
  invalidMapperType: makeError('INVALID_MAPPER_TYPE'),
  invalidJSONAPIFormat: makeError('INVALID_JSONAPI_FORMAT'),

  // validate
  validationError: makeError('VALIDATION_ERROR'),
};

export default errors;
