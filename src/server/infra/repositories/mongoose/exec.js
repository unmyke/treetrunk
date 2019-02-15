const exec = (database, callback) =>
  database.connect().then(() => callback(database));
// .then(() => database.disconnect());

export default exec;
