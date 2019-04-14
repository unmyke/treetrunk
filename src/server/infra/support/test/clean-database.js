import container from '@container';

const { database } = container;

const cleanDatabase = () => {
  if (database) {
    return database
      .connect()
      .then(() => Promise.all(database.models.map((Model) => Model.remove())))
      .catch((err) => {
        console.log(err);
      });
  }
  throw Error("Database doesn't exists");
};

export default cleanDatabase;
