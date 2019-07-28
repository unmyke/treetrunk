const getNestedContainerName = (rootName, rootFactoriesName) =>
  `${rootName ? `${rootName}.` : ''}${rootFactoriesName}`;
export default getNestedContainerName;
