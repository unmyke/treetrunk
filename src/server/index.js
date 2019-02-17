// eslint-disable-next-line import/no-unresolved
import container from '@container';

const { app } = container;

app.on('error', (error) => {
  console.log(error);
  container.app.logger.error(error.stack);
  process.exit();
});

app.start();
