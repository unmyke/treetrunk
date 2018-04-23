import Status from 'http-status';

/* istanbul ignore next */
export const errorHandler = (err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const { logger } = req.container.cradle;

  logger.error(err);

  res.status(Status.INTERNAL_SERVER_ERROR).json({
    type: 'InternalServerError',
    message: 'The server failed to handle this request'
  });
};
