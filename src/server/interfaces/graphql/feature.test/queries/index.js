import seller from './seller';

const queryDescribes = [seller];

const queryTests = (ctx) => {
  describe(':: queries', () => {
    queryDescribes.forEach((queryDescribe) => {
      queryDescribe(ctx);
    });
  });
};
export default queryTests;
