import container from '@container';

const { database } = container;

const cleanDatabase = () => {
  if (database) {
    return database
      .query('SET FOREIGN_KEY_CHECKS = 0')
      .then(() => {
        return database.sync({ force: true });
      })
      .then(() => {
        return database.query('SET FOREIGN_KEY_CHECKS = 1');
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

export default cleanDatabase;
