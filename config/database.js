const commonOptions = {
  useNewUrlParser: true,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  dbName: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_USER,
};

module.exports = {
  development: {
    ...commonOptions,
    host: 'localhost',
    dbName: 'treetrunk-development',
    user: 'treetrunk',
    pass: 'developpass',
  },
  test: {
    ...commonOptions,
    host: 'localhost',
    dbName: 'treetrunk-test',
    user: 'treetrunk',
    pass: 'testpass',
  },
  production: {
    ...commonOptions,
    dbName: 'treetrunk',
  },
};
