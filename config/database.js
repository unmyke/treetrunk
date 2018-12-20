const commonOptions = {
  useNewUrlParser: true,
};

module.exports = {
  development: {
    dbName: 'treetrunk-development',
    user: 'treetrunk',
    pass: 'Tree00trunk',
    ...commonOptions,
  },
  test: {
    dbName: 'treetrunk-test',
    user: 'treetrunk',
    pass: 'Tree00trunk',
    ...commonOptions,
  },
  production: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dbName: process.env.DATABASE_NAME || 'treetrunk',
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PATH,
    ...commonOptions,
  },
};
