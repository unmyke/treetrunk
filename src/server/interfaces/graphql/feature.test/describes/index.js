import getDescribeTableByDescribes from './get-describe-table-by-describes';
import seller from './seller';

const describes = {
  seller,
};

const getDescribeTable = getDescribeTableByDescribes(describes);

export default (config) => () => {
  const describeTable = getDescribeTable(config);
  const describeEach = describe.each(describeTable);

  describeEach(`#%s`, ([, contexts, config]) => {
    contexts.forEach((context) => contextRunner(context, config));
  });
};
