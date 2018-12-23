// import('@babel/polyfill');
import { container } from './container';

container.app.start().catch((error) => {
  app.logger.error(error.stack);
  process.exit();
});
