import Status from 'http-status';
import { Error as jsonapiErrorSerializer } from '../serializers/commonTypes';

/* istanbul ignore next */
export const devErrorHandler = (err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const { logger } = req.container;

  logger.error(err);

  res.status(Status.INTERNAL_SERVER_ERROR).json(
    jsonapiErrorSerializer.serialize(
      {
        code: 'INTERNAL_SERVER_ERROR',
        title: err.message,
        detail: err.stack,
      },
      Status.INTERNAL_SERVER_ERROR
    )
  );
};
