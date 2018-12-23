import { container } from 'src/container';
const { database } = container;

export const cleanDatabase = () => {
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
