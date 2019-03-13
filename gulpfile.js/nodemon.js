// const nodemon = require('nodemon');

const getTaskName = require('./_lib/get-task-name');

// const nodemonServer = nodemon;

module.exports = {
  [getTaskName({ name: 'nodemon', target: 'server' })]: () => Promise.resolve(),
  [getTaskName({ name: 'nodemon', target: 'client' })]: () => Promise.resolve(),
  [getTaskName({ name: 'nodemon', target: 'common' })]: () => Promise.resolve(),
  [getTaskName({ name: 'nodemon' })]: () => Promise.resolve(),
};
