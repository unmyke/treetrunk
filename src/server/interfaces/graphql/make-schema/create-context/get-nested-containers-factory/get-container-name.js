const getFactoryName = (rootName, rootFactoriesName) =>
  `${rootName && `${rootName}.`}${rootFactoriesName}`;
export default getFactoryName;
