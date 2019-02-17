import container from '@container';

const { database } = container;

const cleanDatabase = () => {
  if (database) {
    return database
      .connect()
      .then(() => Promise.all(database.models.map((Model) => Model.drop())))
      .catch((err) => {
        console.log(err);
      });
  }
};

export default cleanDatabase;
