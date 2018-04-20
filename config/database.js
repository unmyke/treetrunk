export const development = {
  username: 'treetrunk',
  password: 'Tree00trunk',
  database: 'treetrunk_development',
  host: '127.0.0.1',
  dialect: 'mysql'
};
export const test = {
  username: 'treetrunk',
  password: 'Tree00trunk',
  database: 'treetrunk_test',
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: null
};
export const production = process.env.DATABASE_URL;
