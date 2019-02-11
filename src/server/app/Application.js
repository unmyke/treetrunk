const Application = ({
  server,
  database,
  logger,
  initializeApplication,
  config: { app: appConfig },
}) => {
  const appInitializer = initializeApplication();

  if (database && database.options.logging) {
    // eslint-disable-next-line no-param-reassign
    database.options.logging = logger.info.bind(logger);
  }

  const start = async () => {
    // if (database) await database.authenticate();

    const { SUCCESS, INITIALIZE_ERROR, ERROR } = appInitializer.outputs;

    appInitializer
      .on(SUCCESS, async () => {
        await server.start();
      })
      .on(INITIALIZE_ERROR, (error) => {
        console.log('Can not initialize. Error:', error);
      })
      .on(ERROR, (error) => {
        console.log(error);
      });

    appInitializer.execute({ config: appConfig });
  };

  return Object.freeze({
    start,
  });
};

export default Application;
