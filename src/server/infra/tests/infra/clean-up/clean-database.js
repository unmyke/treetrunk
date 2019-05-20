const getCleanDatabase = ({ models, logger }) =>
  Promise.all(Object.values(models).map((Model) => Model.remove())).catch(
    (err) => {
      logger.error(err);
      throw err;
    }
  );

export default getCleanDatabase;
