// eslint-disable-next-line import/no-unresolved
import container from '@container';

container.app.start().catch((error) => {
  console.log(error);
  container.app.logger.error(error.stack);
  process.exit();
});
