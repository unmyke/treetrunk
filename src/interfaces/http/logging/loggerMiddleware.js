import morgan from 'morgan';
import { LoggerStreamAdapter } from 'src/infra/logging/LoggerStreamAdapter';

export const loggerMiddleware = ({ logger }) => {
  return morgan('dev', {
    stream: LoggerStreamAdapter.toStream(logger),
  });
};
