import { container } from 'src/container';
const { database } = container;

export const cleanDatabase = () => {
  if (database) {
    return database
      .query('SET FOREIGN_KEY_CHECKS = 0')
      .then(function() {
        return database.sync({ force: true });
      })
      .then(function() {
        return database.query('SET FOREIGN_KEY_CHECKS = 1');
      })
      .then(
        function() {
          console.log('Database synchronised.');
        },
        function(err) {
          console.log(err);
        }
      );
  }
};
