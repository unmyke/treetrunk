import morgan from 'morgan';
import LoggerStreamAdapter from '@infra/logging/Logger-stream-adapter';

const loggerMiddleware = ({ logger }) => {
  return morgan('dev', {
    stream: LoggerStreamAdapter.toStream(logger),
  });
};

export default loggerMiddleware;
