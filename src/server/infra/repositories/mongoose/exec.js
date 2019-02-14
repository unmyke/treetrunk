import container from '@container';
const { database } = container;
console.log(database);

const exec = (callback) =>
  database
    .connect()
    .then(() => callback())
    .then(() => database.disconnect());

export default exec;
