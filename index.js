import { container } from 'src/container';

const { app } = container;
app.start().catch((error) => {
  app.logger.error(error.stack);
  process.exit();
});
