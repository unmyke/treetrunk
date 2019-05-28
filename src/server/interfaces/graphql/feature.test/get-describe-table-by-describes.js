const getDescribeTableByDescribes = (describes) => (opts) =>
  Object.entries(describes).map(([describeName, describe]) => [
    describeName,
    describe,
    opts,
  ]);

export default getDescribeTableByDescribes;
