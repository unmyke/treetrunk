import Status from 'http-status';

/* istanbul ignore next */
export const devErrorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const { logger } = req.container;

  logger.error(err);

  res.status(Status.INTERNAL_SERVER_ERROR).json({
    type: 'InternalServerError',
    message: err.message,
    stack: err.stack
  });
};
