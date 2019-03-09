import getExpressServer from 'express';

export default ({ config, router, logger }) => {
  const express = getExpressServer();
  express.disable('x-powered-by');
  express.use(router);

  const start = () =>
    new Promise((resolve) => {
      const http = express.listen(config.web.port, () => {
        const { port } = http.address();
        logger.info(`[p ${process.pid}] Listening at port ${port}`);
        resolve();
      });
    });

  return Object.freeze({
    start,
  });
};
