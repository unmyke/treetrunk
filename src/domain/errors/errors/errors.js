const makeError = (message) => (detail) => {
  const err = new Error(message);
  err.detail = detail;
  return err;
};

export const errors = {
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
  seniorityTypeAlreadyExists: makeError('SENIORITY_TYPE_ALREADY_EXISTS'),

  // FSM
  transitionNotAllowed: makeError('TRANSITION_NOT_ALLOWED'),

  // factory
  inconsistentState: makeError('INCONSISTENT_STATE'),

  // repository
  modelNotFound: makeError('MODEL_NOT_FOUND'),
  modelAlreadyExists: makeError('MODEL_ALREADY_EXISTS'),
  invalidQuery: makeError('INVALID_QUERY'),
  databaseError: makeError('DATABASE_ERROR'),

  // serializer
  invalidMapperType: makeError('INVALID_MAPPER_TYPE'),

  // validate
  validationError: makeError('VALIDATION_ERROR'),

  // exapmles
  // articleAlreadyBanned: makeError('ARTICLE_BANNED'),
  // articleNotBanned: makeError('ARTICLE_NOT_BANNED'),
  // articleAlreadyApproved: makeError('ARTICLE_ALREADY_APPROVED'),
  // articleNotApproved: makeError('ARTICLE_NOT_APPROVED'),
  // articleAlreadyRated: makeError('ARTICLE_ALREADY_RATED'),
  // articleNotRated: makeError('ARTICLE_NOT_RATED'),
  // reviewProcessAlreadyCompleted: makeError('REVIEW_PROCESS_ALREADY_COMPLETED'),
  // reviewProcessNotCompleted: makeError('REVIEW_PROCESS_NOT_COMPLETED'),
  // reviewAlreadyRated: makeError('REVIEW_ALREADY_RATED'),
  // reviewNotRated: makeError('REVIEW_NOT_RATED'),
  // userAlreadyRated: makeError('USER_ALREADY_RATED'),
  // userNotRated: makeError('USER_NOT_RATED'),
  // userIsNotOwner: makeError('USER_IS_NOT_OWNER'),
  // permisionDenied: makeError('PERMISSION_DENIED'),
  // reviewerAlreadyListed: makeError('REVIEWER_ALREADY_LISTED'),
  // reviewerNotListed: makeError('REVIEWER_NOT_LISTED'),
  // maxArticleReviewersReached: makeError('MAX_ARTICLE_REVIEWERS_REACHED'),
  // editorAlreadyInvited: makeError('EDITOR_ALREADY_INVITED'),
  // editorNotInvited: makeError('EDITOR_NOT_INVITED'),
  // editorAlreadyConfirmed: makeError('EDITOR_ALREADY_CONFIRMED'),
  // editorNotListed: makeError('EDITOR_NOT_LISTED'),
  // stageTooLarge: makeError('STAGE_TOO_LARGE'),
  // stageNotDefined: makeError('STAGE_NOT_DEFINED'),
  // stageNotFinal: makeError('STAGE_NOT_FINAL'),
};
