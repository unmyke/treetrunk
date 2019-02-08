import Status from 'http-status';
import { Error as jsonapiErrorSerializer } from '../serializers/common-types';

const devErrorHandler = (err, req, res, _) => {
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

export default devErrorHandler;
