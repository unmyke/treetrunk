import container from '@container';

const { database, models } = container;

const cleanDatabase = () =>
  database
    .connect()
    .then(() =>
      Promise.all(Object.values(models).map((Model) => Model.remove()))
    )
    .catch((err) => {
      console.log(err);
    });

export default cleanDatabase;
