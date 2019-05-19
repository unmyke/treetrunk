const getCleanDatabase = ({ models, logger }) =>
  Promise.all(Object.values(models).map((Model) => Model.remove()))
    .then(() => {
      logger.info(`[p ${process.pid}] Database cleaned up`);
    })
    .catch((err) => {
      logger.error(err);
    });

export default getCleanDatabase;
