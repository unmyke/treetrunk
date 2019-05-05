import { queryType } from 'nexus';

export { default as seller } from './seller';
export { default as post } from './post';
// export { default as sellers } from './sellers';

export const rootQuery = queryType({
  definition() {},
});
