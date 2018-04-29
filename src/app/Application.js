export class Application {
  constructor({
    server,
    database,
    logger,
    services: Initializer,
    config: { app: appConfig },
  }) {
    this.server = server;
    this.database = database;
    this.logger = logger;
    this.Initializer = Initializer;
    this.appConfig = appConfig;

    if (database && database.options.logging) {
      database.options.logging = logger.info.bind(logger);
    }
  }
  async start() {
    if (this.database) {
      await this.database.authenticate();
    }

    const { SUCCESS, ERROR } = this.Initializer.outputs;

    this.Initializer.on(SUCCESS, async () => {
      await this.server.start();
    }).on(INITIALIZE_ERROR, (error) => {
      console.log('Can not initialize');
    });

    this.Initializer.execute();
  }
}
