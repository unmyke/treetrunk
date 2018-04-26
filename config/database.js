module.exports = {
  development: {
    username: 'treetrunk',
    password: 'Tree00trunk',
    database: 'treetrunk_development',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: 'treetrunk',
    password: 'Tree00trunk',
    database: 'treetrunk_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: null,
  },
  production: process.env.DATABASE_URL,
};
