export class Application {
  constructor({
    server,
    database,
    logger,
    initializeApplication,
    config: { app: appConfig },
  }) {
    this.server = server;
    this.database = database;
    this.logger = logger;
    this.initializeApplication = initializeApplication();
    this.appConfig = appConfig;

    if (database && database.options.logging) {
      database.options.logging = logger.info.bind(logger);
    }
  }
  async start() {
    if (this.database) {
      await this.database.authenticate();
    }

    const {
      SUCCESS,
      INITIALIZE_ERROR,
      ERROR,
    } = this.initializeApplication.outputs;

    this.initializeApplication
      .on(SUCCESS, async () => {
        await this.server.start();
      })
      .on(INITIALIZE_ERROR, (error) => {
        console.log('Can not initialize');
      })
      .on(ERROR, (error) => {
        console.log(error);
      });

    this.initializeApplication.execute({ config: this.appConfig });
  }
}
