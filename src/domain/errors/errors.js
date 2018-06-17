export const makeError = (details) => {
  const error = new Error('NOT_ALLOWED');
  error.details = details;
  return error;
};

export const errors = {
  nothingToUpdate: 'NOTHING_TO_ UPDATE',

  notFound: 'RECORD_NOT_FOUND',
  alreadyExists: 'RECORD_ALREADY_EXISTS',
  differenceOnly: 'DIFFERENCE_ONLY_PERMITTED',
  similarityNotAllowed: 'SIMILARITY_NOT_ALLOWED',
  diaryAlreadyClosed: 'DIARY_ALREADY_CLOSED',
  diaryNotStarted: 'DIARY_NOT_STARTED',

  transitionNotAllowed: 'TRANSITION_NOT_ALLOWED',
  archiveReadOnly: 'ARCHIVE_READ_ONLY',
  backdatingNotPermitted: 'BACKDATING_NOT_PERMITTED',
  closeRecordReadOnly: 'CLOSE_RECORD_READ_ONLY',

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
