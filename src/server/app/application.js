import { EventEmitter } from 'events';
import InitializeApplication from './initialize-application';

const Application = ({
  errors,
  server,
  database,
  logger,
  subdomains,
  repositories,
}) => {
  const app = new EventEmitter();

  const initApp = async () => {
    const appInitializer = InitializeApplication({
      subdomains,
      repositories,
    });

    appInitializer().then(server.start, ({ details }) => {
      throw errors.appInitializeFailure('Can not initialize. Error:', details);
    });
  };

  const connectDatabase = () => {
    if (database && database.options.logging) {
      // eslint-disable-next-line no-param-reassign
      database.options.logging = logger.info.bind(logger);
    }

    return database.connect().then(
      () => {
        console.log('Database connection successful');
      },
      ({ message }) => {
        console.error(`Database connection error: ${message}`);
      }
    );
  };

  const disconnectDatabase = () =>
    database.disconnect().then(() => {
      console.log('Database connection closed');
    });

  const onStart = () => connectDatabase().then(initApp);
  const onStop = () => disconnectDatabase();
  const onError = (e) => {
    logger.log(e);
    app.emit('stop');
  };

  app.once('start', onStart);
  app.on('stop', onStop);
  app.on('error', onError);

  return Object.freeze({
    start: () => app.emit('start'),
    error: () => app.emit('error'),
    stop: () => app.emit('stop'),
    on: app.on.bind(app),
  });
};

export default Application;
