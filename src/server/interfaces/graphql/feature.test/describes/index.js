import getDescribeTableByDescribes from './get-describe-table-by-describes';
import seller from './seller';

const describes = {
  seller,
};

const getDescribeTable = getDescribeTableByDescribes(describes);

export default (opts) => {
  const describeTable = getDescribeTable(opts);
  const describeEach = describe.each(describeTable);

  describeEach(`#%s`, ([, contexts, opts]) => {
    contexts.forEach((context) => contextRunner(context, opts));
  });
};
