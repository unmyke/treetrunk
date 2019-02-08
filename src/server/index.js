import container from '@container';

container.app.start().catch((error) => {
  container.app.logger.error(error.stack);
  process.exit();
});
