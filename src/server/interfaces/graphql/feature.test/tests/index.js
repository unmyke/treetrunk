import outputTests from './outputs';
import inputTests from './inputs';

const tests = ({ url, ...ctx }) => {
  describe(`GraphQL endpoint ${url}`, () => {
    outputTests(ctx);
    inputTests(ctx);
  });
};
export default tests;
