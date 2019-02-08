import Status from 'http-status';
import { Error as ErrorSerializer } from '../serializers/common-types';

/* istanbul ignore next */
const errorHandler = (err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const { logger } = req.container.cradle;

  logger.error(err);

  res.status(Status.INTERNAL_SERVER_ERROR).json(
    ErrorSerializer.serialize(
      {
        code: 'INTERNAL_SERVER_ERROR',
        title: err.message,
        message: 'The server failed to handle this request',
      },
      Status.INTERNAL_SERVER_ERROR
    )
  );
};

export default errorHandler;
