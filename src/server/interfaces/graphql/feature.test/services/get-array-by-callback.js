const getArrayByCallback = (count, callback) => {
  const iter = (acc, curCount) => {
    if (curCount <= 0) return acc;

    return iter([...acc, callback()], curCount - 1);
  };

  return iter([], count);
};

export default getArrayByCallback;
