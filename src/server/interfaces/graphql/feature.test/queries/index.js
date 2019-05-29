import seller from './seller';

const queryDescribes = {
  seller,
};

const queryTests = (config) => {
  const {
    utils: { getDescribes },
  } = config;

  getDescribe({
    name: 'Queries',
    callback: getDescribes(queryDescribes, config),
  });
};
